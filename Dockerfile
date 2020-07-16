# We use Debian images because they are considered more stable than the alpine
# ones becase they use a different C compiler. Debian images also come with
# all useful packages required for image manipulation out of the box. They
# however weight a lot, approx. up to 1.5GiB per built image.
FROM python:3.6.6-stretch AS base

WORKDIR /app

# Set default environment variables. They are used at build time and runtime.
# If you specify your own environment variables on Heroku or Dokku, they will
# override the ones set here. The ones below serve as sane defaults only.
#  * PYTHONUNBUFFERED - This is useful so Python does not hold any messages
#    from being output.
#    https://docs.python.org/3.8/using/cmdline.html#envvar-PYTHONUNBUFFERED
#    https://docs.python.org/3.8/using/cmdline.html#cmdoption-u
#  * PYTHONPATH - enables use of django-admin command.
#  * DJANGO_SETTINGS_MODULE - default settings used in the container.
#  * PORT - default port used. Please match with EXPOSE so it works on Dokku.
#    Heroku will ignore EXPOSE and only set PORT variable. PORT variable is
#    read/used by Gunicorn.
#  * WEB_CONCURRENCY - number of workers used by Gunicorn. The variable is
#    read by Gunicorn.
#  * GUNICORN_CMD_ARGS - additional arguments to be passed to Gunicorn. This
#    variable is read by Gunicorn
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    DJANGO_SETTINGS_MODULE=mresponse.settings.production \
    PORT=8000 \
    WEB_CONCURRENCY=3 \
    GUNICORN_CMD_ARGS="--max-requests 1200 --access-logfile -"

# Port exposed by this container. Should default to the port used by your WSGI
# server (Gunicorn). This is read by Dokku only. Heroku will ignore this.
EXPOSE 8000

# Intsall WSGI server - Gunicorn - that will serve the application.
RUN pip install "gunicorn== 19.9.0"

# Install your app's Python requirements.
COPY requirements.txt /
RUN pip install -r /requirements.txt

# Don't use the root user as it's an anti-pattern and Heroku does not run
# containers as root either.
# https://devcenter.heroku.com/articles/container-registry-and-runtime#dockerfile-commands-and-runtime

RUN useradd mresponse -m
RUN chown -R mresponse .
USER mresponse

# =========================================================================== #
# base-dev image                                                              #
# =========================================================================== #
FROM base AS base-dev

# Install operating system dependencies.
USER root
RUN apt-get update -y && \
    apt-get install -y apt-transport-https rsync && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get update -y &&\
    apt-get install nodejs yarn &&\
    rm -rf /var/lib/apt/lists/*
USER mresponse

# Install front-end dependencies.
COPY --chown=mresponse mresponse/frontend/app/package.json mresponse/frontend/app/yarn.lock ./
RUN yarn install --frozen-lockfile
ENV NODE_PATH=/app/node_modules
RUN mkdir frontend
WORKDIR /app/frontend

# =========================================================================== #
# frontend-builder image                                                      #
# =========================================================================== #
FROM base-dev AS frontend-builder

ENV NODE_ENV=production

# Compile static files
COPY --chown=mresponse mresponse/frontend/app/ ./
RUN rm -r build
RUN yarn build

# =========================================================================== #
# prod image                                                                  #
# =========================================================================== #
FROM base AS prod

# Copy application code.
WORKDIR /app
COPY --chown=mresponse . .

# Collect static. This command will move static files from application
# directories and "static_compiled" folder to the main static directory that
# will be served by the WSGI server.
RUN rm -r mresponse/frontend/app
COPY --from=frontend-builder /app/frontend/webpack-stats.json ./mresponse/frontend/app/
COPY --from=frontend-builder /app/frontend/build ./mresponse/frontend/app/build
RUN SECRET_KEY=none django-admin collectstatic --noinput --clear

# Run the WSGI server. It reads GUNICORN_CMD_ARGS, PORT and WEB_CONCURRENCY
# environment variable hence we don't specify a lot options below.
CMD gunicorn mresponse.wsgi:application

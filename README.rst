m-response
==========

Set up local environment
------------------------

To set up the project VM you’ll need `docker` and `docker-compose` . You can
start it up using the following commands.

.. code:: sh

   docker-compose build

Compile static assets
~~~~~~~~~~~~~~~~~~~~~

.. code:: sh

   docker-compose run web bash
   cd mresponse/frontend/app/
   yarn install
   yarn start  # "yarn build" for the production build

The watcher (`yarn start`) has to be run locally (outside VM). We use Node
8 LTS and Yarn stable.

Create database and administrator user
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sh

   docker-compose run web bash
   ./manage.py migrate
   ./manage.py createsuperuser

Start the server
~~~~~~~~~~~~~~~~

.. code:: sh

  docker-compose up

Then you can visit administration panel at http://localhost:8000/admin/.

The application uses external authentication. To log-in locally please do it
through the administration interface instead.

Auth0 Configuration
~~~~~~~~~~~~~~~~~~~

The project uses Auth0 as an authentication mechanism. To get Auth0 working
correctly you will need to a .env` configuration file (The required
variables can be seen in `./mresponse/frontend/app/.env.example`).

Developing on localhost can also cause issues with Auth0 so it is recommended
that you add the following to your `/etc/hosts/` file and develop from
http://mresponse.local/

.. code::

    127.0.0.1       mresponse.local

On the backend you need to set two environment variables - ``AUTH0_DOMAIN`` and
``JWT_ISSUER``.

Data Retrieval from the Google Playstore
~~~~~~~~~~~~~~~~~~~

To retrieve (download) reviews and publish (upload) responses on the Google Playstore, there is a small service.
This service lives in its own repo: https://github.com/mozilla/m-response-api



from invoke import run as local
from invoke.exceptions import Exit
from invoke.tasks import task

PRODUCTION_APP_INSTANCE = 'mresponse-production'

STAGING_APP_INSTANCE = 'mresponse-staging'

LOCAL_MEDIA_FOLDER = '/vagrant/media'
LOCAL_DATABASE_NAME = 'mresponse'


############
# Production
############


@task
def pull_production_media(c):
    pull_media_from_s3_heroku(c, PRODUCTION_APP_INSTANCE)


@task
def push_production_media(c):
    raise RuntimeError('Please check the configuration of the fabfile before using it.')
    push_media_to_s3_heroku(c, PRODUCTION_APP_INSTANCE)


@task
def pull_production_data(c):
    pull_database_from_heroku(c, PRODUCTION_APP_INSTANCE)


@task
def push_production_data(c):
    raise RuntimeError('Please check the configuration of the fabfile before using it.')
    push_database_to_heroku(c, PRODUCTION_APP_INSTANCE)


@task
def deploy_production(c):
    raise RuntimeError('Please check the configuration of the fabfile before using it.')
    deploy_to_heroku(c, PRODUCTION_APP_INSTANCE, local_branch='master',
                     remote_branch='master')


@task
def production_shell(c):
    open_heroku_shell(c, PRODUCTION_APP_INSTANCE)


#########
# Staging
#########


@task
def pull_staging_data(c):
    pull_database_from_heroku(c, STAGING_APP_INSTANCE)


@task
def pull_staging_media(c):
    pull_media_from_s3_heroku(c, STAGING_APP_INSTANCE)


@task
def push_staging_media(c):
    raise RuntimeError('Please check the configuration of the fabfile before using it.')
    push_media_to_s3_heroku(c, STAGING_APP_INSTANCE)


@task
def push_staging_data(c):
    raise RuntimeError('Please check the configuration of the fabfile before using it.')
    push_database_to_heroku(c, STAGING_APP_INSTANCE)


@task
def deploy_staging(c):
    deploy_to_heroku(c, STAGING_APP_INSTANCE, local_branch='staging',
                     remote_branch='master')


@task
def staging_shell(c):
    open_heroku_shell(c, STAGING_APP_INSTANCE)


#######
# Local
#######


def clean_local_database(c, local_database_name=LOCAL_DATABASE_NAME):
    local(
        'sudo -u postgres psql  -d {database_name} -c "DROP SCHEMA public '
        'CASCADE; CREATE SCHEMA public;"'.format(
            database_name=local_database_name
        )
    )


def delete_local_database(c, local_database_name=LOCAL_DATABASE_NAME):
    local('dropdb --if-exists {database_name}'.format(
        database_name=LOCAL_DATABASE_NAME
    ))


########
# Heroku
########

def check_if_logged_in_to_heroku(c):
    if not local('heroku auth:whoami', warn=True):
        raise Exit(
            'Log-in with the "heroku login" command before running this '
            'command.'
        )


def get_heroku_variable(c, app_instance, variable):
    check_if_logged_in_to_heroku(c)
    return local('heroku config:get {var} --app {app}'.format(
        app=app_instance,
        var=variable,
    )).stdout.strip()


def pull_media_from_s3_heroku(c, app_instance):
    check_if_logged_in_to_heroku(c)
    aws_access_key_id = get_heroku_variable(c, app_instance,
                                            'AWS_ACCESS_KEY_ID')
    aws_secret_access_key = get_heroku_variable(c, app_instance,
                                                'AWS_SECRET_ACCESS_KEY')
    aws_storage_bucket_name = get_heroku_variable(c, app_instance,
                                                  'AWS_STORAGE_BUCKET_NAME')
    pull_media_from_s3(c, aws_access_key_id, aws_secret_access_key,
                       aws_storage_bucket_name)


def push_media_to_s3_heroku(c, app_instance):
    check_if_logged_in_to_heroku(c)
    prompt_msg = 'You are about to push your media folder contents to the ' \
                 'S3 bucket. It\'s a destructive operation. \n' \
                 'Please type the application name "{app_instance}" to ' \
                 'proceed:\n>>> '.format(app_instance=make_bold(app_instance))
    if input(prompt_msg) != app_instance:
        raise Exit("Aborted")
    aws_access_key_id = get_heroku_variable(c, app_instance,
                                            'AWS_ACCESS_KEY_ID')
    aws_secret_access_key = get_heroku_variable(c, app_instance,
                                                'AWS_SECRET_ACCESS_KEY')
    aws_storage_bucket_name = get_heroku_variable(c, app_instance,
                                                  'AWS_STORAGE_BUCKET_NAME')
    push_media_to_s3(c, aws_access_key_id, aws_secret_access_key,
                     aws_storage_bucket_name)


def pull_database_from_heroku(c, app_instance):
    check_if_logged_in_to_heroku(c)
    delete_local_database(c)
    local('heroku pg:pull --app {app} DATABASE_URL {local_database}'.format(
        app=app_instance,
        local_database=LOCAL_DATABASE_NAME
    ))


def push_database_to_heroku(c, app_instance):
    check_if_logged_in_to_heroku(c)
    prompt_msg = 'You are about to push your local database to Heroku. ' \
                 'It\'s a destructive operation and will override the ' \
                 'database on the server. \n' \
                 'Please type the application name "{app_instance}" to ' \
                 'proceed:\n>>> '.format(app_instance=make_bold(app_instance))
    if input(prompt_msg) != app_instance:
        raise Exit("Aborted")
    local('heroku maintenance:on --app {app}'.format(app=app_instance))
    local('heroku ps:stop --app {app} web'.format(app=app_instance))
    local('heroku pg:backups:capture --app {app}'.format(app=app_instance))
    local('heroku pg:reset --app {app} --confirm {app}'.format(app=app_instance))
    local('heroku pg:push --app {app} {local_db} DATABASE_URL'.format(
        app=app_instance,
        local_db=LOCAL_DATABASE_NAME
    ))
    local('heroku ps:restart --app {app}'.format(app=app_instance))
    local('heroku maintenance:off --app {app}'.format(app=app_instance))


def setup_heroku_git_remote(c, app_instance):
    check_if_logged_in_to_heroku(c)
    remote_name = 'heroku-{app}'.format(app=app_instance)
    local('heroku git:remote --app {app} --remote {remote}'.format(
        app=app_instance, remote=remote_name
    ))
    return remote_name


def deploy_to_heroku(c, app_instance, local_branch='master',
                     remote_branch='master'):
    check_if_logged_in_to_heroku(c)
    print(
        'This will push your local "{local_branch}" branch to remote '
        '"{remote_branch}" branch.'.format(
            local_branch=local_branch,
            remote_branch=remote_branch
        )
    )
    deploy_prompt(c, app_instance)
    remote_name = setup_heroku_git_remote(c, app_instance)
    local('git push {remote} {local_branch}:{remote_branch}'.format(
        remote=remote_name,
        local_branch=local_branch,
        remote_branch=remote_branch,
    ))


def open_heroku_shell(c, app_instance, shell_command='bash'):
    check_if_logged_in_to_heroku(c)
    local('heroku run --app {app} {command}'.format(
        app=app_instance,
        command=shell_command,
    ))


####
# S3
####


def aws(c, command, aws_access_key_id, aws_secret_access_key, **kwargs):
    return local(
        'AWS_ACCESS_KEY_ID={access_key_id} AWS_SECRET_ACCESS_KEY={secret_key} '
        'aws {command}'.format(
            access_key_id=aws_access_key_id,
            secret_key=aws_secret_access_key,
            command=command,
        ),
        **kwargs
    )


def pull_media_from_s3(c, aws_access_key_id, aws_secret_access_key,
                       aws_storage_bucket_name,
                       local_media_folder=LOCAL_MEDIA_FOLDER):
    aws_cmd = 's3 sync --delete s3://{bucket_name} {local_media}'.format(
        bucket_name=aws_storage_bucket_name,
        local_media=local_media_folder,
    )
    aws(c, aws_cmd, aws_access_key_id, aws_secret_access_key)


def push_media_to_s3(c, aws_access_key_id, aws_secret_access_key,
                     aws_storage_bucket_name,
                     local_media_folder=LOCAL_MEDIA_FOLDER):
    aws_cmd = 's3 sync --delete {local_media} s3://{bucket_name}/'.format(
        bucket_name=aws_storage_bucket_name,
        local_media=local_media_folder,
    )
    aws(c, aws_cmd, aws_access_key_id, aws_secret_access_key)


###########
# Utilities
###########

def deploy_prompt(c, app_instance):
    prompt_msg = 'You are about to do a manual deployment. You probably ' \
                 'should use automatic deployments on CI. \nPlease type ' \
                 'the application name "{app_instance}" in order to ' \
                 'proceed:\n>>> '.format(app_instance=make_bold(app_instance))
    if input(prompt_msg) != app_instance:
        raise Exit("Aborted")


def make_bold(msg):
    return "\033[1m{}\033[0m".format(msg)

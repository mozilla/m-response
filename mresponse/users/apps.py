from django import apps


class UsersConfig(apps.AppConfig):
    name = "mresponse.users"

    def ready(self):
        from mresponse.users.signal_handlers import register_signal_handlers

        register_signal_handlers()

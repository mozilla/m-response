class SkipBasicAuthForAPI:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/'):
            setattr(request, '_skip_basic_auth_ip_whitelist_middleware_check', True)
        return self.get_response(request)

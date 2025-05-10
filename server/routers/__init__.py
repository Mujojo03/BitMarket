from .auth_router import init_auth_routes
from .user_router import init_user_routes

def initialize_routes(api):
    init_auth_routes(api)
    init_user_routes(api)

from .product_router import init_product_routes
from .category_router import init_category_routes
from .auth_router import init_auth_routes
from .cart_router import init_cart_routes
from .order_router import init_order_routes
from .product_order_router import init_product_order_routes
from .payment_router import init_payment_routes
from .transaction_router import init_transaction_routes
from .wallet_router import init_wallet_routes
from .profile_router import init_profile_routes

from .user_router import init_user_routes

def initialize_routes(api):
    init_auth_routes(api)
    init_category_routes(api)
    init_product_routes(api)
    init_user_routes(api)
    init_cart_routes(api)
    init_order_routes(api)
    init_product_order_routes(api)
    init_payment_routes(api)
    init_transaction_routes(api)
    init_wallet_routes(api)
    init_profile_routes(api)
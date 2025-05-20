"""
permissions.py

This module defines role-based permissions used throughout the application
to control access to certain actions and features.

Each role is associated with a list of permission strings.
These permissions are checked in methods like User.has_permission().
"""

ROLE_PERMISSIONS = {
    "admin": ["view_users","edit_users", "delete_users", "edit_products", "delete_products" "delete_orders","create_categories", "edit_categories", "delete_categories"],
    "seller": ["create_products", "edit_own_products"],
    "buyer": ["place_orders", "view_own_orders"]
}

# ROLE_PERMISSIONS = {
#     "admin": [
#         "view_users",
#         "edit_products",
#         "delete_orders"
#     ],
#     "seller": [
#         "create_products",
#         "edit_own_products"
#     ],
#     "buyer": [
#         "place_orders",
#         "view_own_orders"
#     ]
# }


def get_permissions_for_role(role):
    """
    Retrieve the list of permissions for a given role.

    Args:
        role (str): The role name (e.g., 'admin', 'buyer').

    Returns:
        list: A list of permission strings associated with the role.
              Returns an empty list if the role is not defined.
    """
    return ROLE_PERMISSIONS.get(role, [])


def has_role(user, role_title):
    """
    Check if a user has a specific role.

    Args:
        user (User): The user instance.
        role_title (str): The role to check.
    
    Returns:
        bool: True if the user has the role, False otherwise.
    """
    return any(role.title == role_title for role in user.roles)
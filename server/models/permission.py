"""
permissions.py

This module defines role-based permissions used throughout the application
to control access to certain actions and features.

Each role is associated with a list of permission strings.
These permissions are checked in methods like User.has_permission().
"""

ROLE_PERMISSIONS = {
    "admin": ["view_users", "edit_products", "delete_orders"],
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


# def get_permissions_for_role(role):
#     """
#     Retrieve the list of permissions for a given role.

#     Args:
#         role (str): The role name (e.g., 'admin', 'buyer').

#     Returns:
#         list: A list of permission strings associated with the role.
#               Returns an empty list if the role is not defined.
#     """
#     return ROLE_PERMISSIONS.get(role, [])
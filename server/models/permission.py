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
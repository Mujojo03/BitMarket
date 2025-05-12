from models.db import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt
from models.permission import ROLE_PERMISSIONS

bcrypt = Bcrypt()

class User(db.Model,SerializerMixin):

    """
    User model represents a system user. Each user can have roles, wallets, products, carts, and orders.

    Attributes:
        id (int): Primary key.
        username (str): Unique username.
        email (str): Unique email address.
        _password_hash (str): Hashed password.

    Relationships:
        roles: Many-to-many link to roles through UserRole.
        wallets: One-to-many link to Wallet.
        products: One-to-many link to Product.
        orders: One-to-many link to Order.
        carts: One-to-many link to Cart.
    """

    __tablename__ = 'users'

    serialize_rules = ('-orders', '-carts','-_password_hash','-wallets')

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), nullable = False, unique =True)
    email= db.Column(db.String(255), nullable = False, unique = True)
    _password_hash = db.Column(db.String, nullable=False)



    roles = db.relationship('UserRole', back_populates='user', cascade="all, delete-orphan")
    wallets = db.relationship('Wallet', back_populates='user', cascade="all, delete-orphan")
    products = db.relationship('Product', back_populates='seller', cascade="all, delete-orphan")
    orders = db.relationship('Order', back_populates='buyer', cascade="all, delete-orphan")
    carts = db.relationship('Cart', back_populates='user', cascade="all, delete-orphan")

    @hybrid_property
    def password(self):
        return self._password_hash

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "roles": [ur.role.title for ur in self.roles]
        }
    
    def has_permission(self, permission):
        """
            Check if user has a specific permission based on their assigned roles.

            This method loops through the user's roles and checks if the given permission
            is included in the role's allowed permissions defined in ROLE_PERMISSIONS.

            Args:
                permission (str): The name of the permission to check (e.g., 'edit_products').

            Returns:
                bool: True if the user has the permission, False otherwise.
        """
        user_roles = [user_role.role.title for user_role in self.roles]
        for role in user_roles:
            if permission in ROLE_PERMISSIONS.get(role, []):
                return True
        return False
from models.db import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

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

    # orders = db.relationship('Order', back_populates = 'user')
    # carts = db.relationship('Cart', back_populates = 'user')

    @hybrid_property
    def password(self):
        return self._password_hash

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
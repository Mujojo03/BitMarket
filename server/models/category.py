from models.db import db
from sqlalchemy_serializer import SerializerMixin

class Category(db.Model, SerializerMixin):
    """
    Category model represents product classifications.

    Attributes:
        id (int): Primary key.
        name (str): Category name.

    Relationships:
        products: List of products under this category.
    """
    __tablename__ = 'categories'

    serialize_rules = ('-products.category',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    deleted = db.Column(db.Boolean, default=False, nullable=False)

    products = db.relationship(
    'Product',
    back_populates='category',
    cascade="all, delete-orphan",
    lazy='dynamic'
)

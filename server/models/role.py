from models.db import db
from sqlalchemy_serializer import SerializerMixin

class Role(db.Model, SerializerMixin):
    """
    Role model defines a user role (e.g., buyer, seller, admin).

    Attributes:
        id (int): Primary key.
        title (str): Unique name of the role.

    Relationships:
        user_roles: List of associated UserRole instances.
    """
    __tablename__ = 'roles'

    serialize_rules = ('-user_roles.role',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=True, nullable=False)

    user_roles = db.relationship('UserRole', back_populates='role', cascade="all, delete-orphan")

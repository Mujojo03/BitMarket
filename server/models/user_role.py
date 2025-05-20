from models.db import db
from sqlalchemy_serializer import SerializerMixin


class UserRole(db.Model, SerializerMixin):
    """
    UserRole is a join table linking users to roles, supporting many-to-many relationships.

    Attributes:
        user_id (int): Foreign key to a user.
        role_id (int): Foreign key to a role.

    Relationships:
        user: The associated User.
        role: The associated Role.
    """

    __tablename__ = 'user_roles'

    serialize_rules = ('-user.roles', '-role.user_roles')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), primary_key=True)
    
    
    role = db.relationship('Role', back_populates='user_roles')
    user = db.relationship('User', back_populates='roles')

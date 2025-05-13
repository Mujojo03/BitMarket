from models import db, User

def get_user_by_id(user_id):
    """Fetch a user by ID."""
    user = User.query.get(user_id)
    if not user:
        return None
    return user

def get_all_users():
    """Fetch all users."""
    return User.query.all()

def update_user(user, data):
    """Update user attributes."""
    for attr, value in data.items():
        if attr in ['username', 'email']:
            setattr(user, attr, value)
        if attr == 'password':
            user.password = value  # triggers setter
    db.session.commit()
    return user

def delete_user(user):
    """Delete a user from the database."""
    db.session.delete(user)
    db.session.commit()

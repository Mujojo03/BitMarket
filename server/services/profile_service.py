from models import User, db

def get_profile(user_id):
    """Fetch the profile of the current user."""
    user = User.query.get(user_id)
    return user

def update_profile(user_id, data):
    """Update the profile of the current user."""
    user = User.query.get(user_id)
    if not user:
        return None, "User not found"

    username = data.get("username")
    if not username:
        return None, "No username provided"

    user.username = username
    db.session.commit()
    return user, None
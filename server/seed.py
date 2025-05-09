# seed_roles.py
from app import app
from models.db import db
from models.role import Role

with app.app_context():
    role_titles = ['buyer', 'seller', 'admin']
    for title in role_titles:
        if not Role.query.filter_by(title=title).first():
            db.session.add(Role(title=title))
    db.session.commit()
    print("Roles seeded.")



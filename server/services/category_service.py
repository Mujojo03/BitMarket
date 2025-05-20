from models import db
from models.category import Category

def get_all_categories():
    return Category.query.filter_by(deleted=False).all()

def get_category_by_id(category_id):
    return Category.query.filter_by(id=category_id, deleted=False).first()

def create_category(name):
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return category

def update_category(category, name):
    category.name = name
    db.session.commit()
    return category

def delete_category(category):
    # Soft delete
    category.deleted = True
    db.session.commit()

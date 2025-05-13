from models import db
from models.category import Category

def get_all_categories():
    return Category.query.all()

def get_category_by_id(category_id):
    return Category.query.get(category_id)

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
    db.session.delete(category)
    db.session.commit()

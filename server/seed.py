from app import create_app
from models.db import db
from models.role import Role
from models.user import User
from models.user_role import UserRole
from models.product import Product
from models.order import Order
from models.product_order import ProductOrder
from models.cart import Cart
from models.category import Category
from models.payment import Payment
from models.transaction import Transaction
from models.wallet import Wallet
from datetime import datetime, timedelta
import random
from faker import Faker

app = create_app()
fake = Faker()

def seed_data():
    with app.app_context():
        # ------------------- Seed Roles -------------------
        role_titles = ['buyer', 'seller', 'admin']
        for title in role_titles:
            if not Role.query.filter_by(title=title).first():
                db.session.add(Role(title=title))
        db.session.commit()
        print("✅ Roles seeded.")

        # ------------------- Seed Users + UserRoles -------------------
        if User.query.count() == 0:
            users_data = [
                {"email": "seller1@example.com", "password": "password1", "username": "Alice", "role": "seller"},
                {"email": "seller2@example.com", "password": "password2", "username": "Bob", "role": "seller"},
                {"email": "buyer1@example.com", "password": "password3", "username": "Charlie", "role": "buyer"},
                {"email": "buyer2@example.com", "password": "password4", "username": "Dana", "role": "buyer"},
                {"email": "buyer3@example.com", "password": "password5", "username": "Evan", "role": "buyer"},
            ]
            for u in users_data:
                role = Role.query.filter_by(title=u.pop("role")).first()
                user = User(**u)
                user.password = u["password"]  # triggers setter
                db.session.add(user)
                db.session.flush()
                db.session.add(UserRole(user_id=user.id, role_id=role.id))
            db.session.commit()
            print("✅ Users + UserRoles seeded.")

        # ✅ Re-fetch users to ensure they're attached to the session
        users = User.query.all()
        sellers = users[:2]
        buyers = users[2:]

        # ------------------- Seed Categories -------------------
        if Category.query.count() == 0:
            category_names = ['Electronics','Cosmetics', 'Books', 'Fashion and Clothing', 'Food and Beverages', 'Home and Kitchen', 'Health and Beauty', 'Crafts and Arts', 'Sports and Outdoors', 'Toys and Games', 'Automotive', 'Pet Supplies', 'Textiles and Fabrics']
            for name in category_names:
                db.session.add(Category(name=name))
            db.session.commit()
            print("✅ Categories seeded.")
        categories = Category.query.filter_by(deleted=False).all()
        if not categories:
            raise Exception("No active categories found. Cannot seed products.")

        # ------------------- Seed Products -------------------
        product_images = [
            "https://d16zmt6hgq1jhj.cloudfront.net/product/10916/Manji%20Choco%20Chip%20Cookies%20500g.jpg",
            "https://d16zmt6hgq1jhj.cloudfront.net/product/11022/Millbakers%20Heart%20Deli%20750g.jpg",
            "https://d16zmt6hgq1jhj.cloudfront.net/product/10029/Daima%20Esl%20Fresh%20Milk%20500Ml.jpg",
            "https://d16zmt6hgq1jhj.cloudfront.net/product/1421/Fresh%20Red%20Seedless%20Grapes%20500G.jpg",
            "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/01/009419/1.jpg",
            "https://cdn.mafrservices.com/sys-master-root/h55/h58/16871976566814/13866_1.jpg",
            "https://cdn.mafrservices.com/sys-master-root/h7d/hbd/50866627182622/194745_main.jpg",
            "https://cdn.mafrservices.com/sys-master-root/hcc/h2b/16930286338078/9014_main.jpg",
            "https://cdn.mafrservices.com/sys-master-root/h33/h3e/16930287353886/9006_main.jpg",
            "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/98/572685/1.jpg",
        ]
        if Product.query.count() == 0:
            for _ in range(20):
                product = Product(
                    name=fake.unique.catch_phrase(),
                    description=fake.text(max_nb_chars=150),
                    price_sats=random.randint(10_000, 500_000),
                    stock_quantity=random.randint(10, 100),
                    img_url=random.choice(product_images),
                    seller_id=random.choice(sellers).id,
                    category_id=random.choice(categories).id
                )
                db.session.add(product)
            db.session.commit()
            print("✅ Products seeded with Faker.")
        products = Product.query.filter_by(deleted=False).all()

        # ------------------- Seed Orders and ProductOrders -------------------
        if Order.query.count() == 0:
            for _ in range(5):
                buyer = random.choice(buyers)
                order = Order(
                    buyer_id=buyer.id,
                    status=random.choice(['pending', 'paid', 'shipped']),
                )
                db.session.add(order)
                db.session.flush()

                num_products = min(len(products), random.randint(1, 3))
                if num_products == 0:
                    print("⚠️ Warning: No products available to create ProductOrders.")
                    continue
                selected_products = random.sample(products, num_products)

                for product in selected_products:
                    quantity = random.randint(1, 5)
                    product_order = ProductOrder(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=quantity,
                        subtotal=product.price_sats * quantity,
                        status='pending'
                    )
                    db.session.add(product_order)
                    product.stock_quantity = max(product.stock_quantity - quantity, 0)
            db.session.commit()
            print("✅ Orders and ProductOrders seeded.")

        # ------------------- Seed Carts -------------------
        if Cart.query.count() == 0:
            for user in users:
                num_products = min(len(products), random.randint(1, 3))
                if num_products == 0:
                    print("⚠️ Warning: No products available to select.")
                    continue
                selected_products = random.sample(products, num_products)

                for product in selected_products:
                    quantity = random.randint(1, 2)
                    item = Cart(
                        user_id=user.id,
                        product_id=product.id,
                        quantity=quantity
                    )
                    db.session.add(item)
            db.session.commit()
            print("✅ Carts seeded.")

def reset_database():
    with app.app_context():
        print("🔄 Dropping all tables...")
        db.drop_all()
        db.create_all()
        print("✅ Tables recreated.")
        print("🌱 Seeding database...")
        seed_data()

if __name__ == "__main__":
    reset_database()
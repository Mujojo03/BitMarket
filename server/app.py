from flask import Flask,request,jsonify
from flask_migrate import Migrate
from flask import request, session
from flask_restful import Resource,Api
from datetime import datetime
from models.db import db
from models.cart import Cart
from models.order import Order
from models.transaction import Transaction
from models.wallet import Wallet
from models.product_order import Product_Order
from models.payment import Payment
from models.escrow import Escrow
from models.user_role import User_Role
from models.product_order import OrderItem
from models.product import Product
from models.user import User
from flask_cors import CORS
from flask_bcrypt import Bcrypt

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bitmarket.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
# app.secret_key = 'your_secret_key'  # Replace with a strong secret key  # Initialize Bcrypt with the app
bcrypt = Bcrypt(app)

migrate = Migrate(app,db)
db.init_app(app)

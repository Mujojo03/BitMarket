from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.routes import auth_bp, products_bp, orders_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    
    @app.route('/')
    def index():
        return jsonify({
            "message": "BitMarket API is running",
            "version": "1.0.0",
            "endpoints": {
                "auth": "/api/auth",
                "products": "/api/products",
                "orders": "/api/orders"
            }
        })
    
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy"})
    
    return app
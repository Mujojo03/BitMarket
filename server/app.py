import os
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config.config import DevelopmentConfig, ProductionConfig
from routers import initialize_routes
import models

def create_app():
    app = Flask(__name__)

    # Select configuration based on FLASK_ENV
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'development':
        app.config.from_object(DevelopmentConfig)
    elif env == 'production':
        app.config.from_object(ProductionConfig)
    else:
        raise ValueError(f"Invalid FLASK_ENV value: {env}")

    # Initialize extensions
    CORS(app)
    bcrypt = Bcrypt(app)
    models.db.init_app(app)
    migrate = Migrate(app, models.db)
    jwt = JWTManager(app)
    api = Api(app)

    # Register routes
    initialize_routes(api)

    return app

# This is the key fix for Gunicorn compatibility:
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
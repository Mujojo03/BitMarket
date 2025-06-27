import os
import threading
from pathlib import Path
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, join_room, leave_room
from dotenv import load_dotenv

# Load environment variables from .env relative to this file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# print("Loaded env from:", env_path)
# print("LND_CERT_PATH =", os.getenv("LND_CERT_PATH"))
# print("LND_MACAROON_PATH =", os.getenv("LND_MACAROON_PATH"))
# print("LND_HOST =", os.getenv("LND_HOST"))

from config.config import DevelopmentConfig, ProductionConfig
from routers import initialize_routes
# from routers.invoice_router import invoice_bp

import models 


# Global SocketIO instance
socketio = SocketIO(cors_allowed_origins="*")  # Allow all origins for now

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
    
    print("JWT_SECRET_KEY =", app.config.get("JWT_SECRET_KEY"))
    print("SECRET_KEY =", app.config.get("SECRET_KEY"))


    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

    # origins = ["http://localhost:3000"]
    # CORS(app, resources={r"/*": {"origins": origins}})
    
    
    Bcrypt(app)
    models.db.init_app(app)
    Migrate(app, models.db)
    JWTManager(app)
    api = Api(app)

    # Register API routes
    initialize_routes(api)

    # Initialize SocketIO with app
    socketio.init_app(app)

    # Register blueprint route
    # app.register_blueprint(invoice_bp, url_prefix="/")

    return app

# --------- LND Service Invoice Streaming ---------

# from services.lnd_service import LNDService

# # Initialize LNDService dynamically, default to alice if no env var
# lnd_node = os.getenv("LND_NODE", "alice")
# lnd_service = LNDService(node=lnd_node)


def invoice_callback(invoice, socketio=None):
    """Callback for settled invoices."""
    payment_hash = invoice.r_hash.hex()

    # Update payment status and notify clients
    # lnd_service.mark_payment_settled(payment_hash, socketio)

    socketio.emit("invoice_settled", {
        "payment_hash": payment_hash,
        "memo": invoice.memo,
        "amount": invoice.amt_paid_sat,
        "settled": True
    })

def start_invoice_stream():
    # """Start LND invoice subscription in a background thread."""
    thread = threading.Thread(
        # target=lnd_service.stream_invoices,
        kwargs={"callback": invoice_callback, "socketio": socketio}
    )
    thread.daemon = True
    thread.start()

# --------- WebSocket event handlers ---------
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def on_join(data):
    user_id = data.get('user_id')
    if user_id:
        join_room(f"user_{user_id}")
        print(f"User {user_id} joined room")

@socketio.on('leave')
def on_leave(data):
    user_id = data.get('user_id')
    if user_id:
        leave_room(f"user_{user_id}")
        print(f"User {user_id} left room")

# --------- Run the App ---------
if __name__ == '__main__':
    app = create_app()
    start_invoice_stream()
    socketio.run(app, host='0.0.0.0', port=5000)
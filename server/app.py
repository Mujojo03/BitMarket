import os
import threading
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, join_room, leave_room
from config.config import DevelopmentConfig, ProductionConfig
from routers import initialize_routes
from dotenv import load_dotenv
import models

# Load environment variables
load_dotenv()

# Global SocketIO instance (initialized later with the app)
socketio = SocketIO(cors_allowed_origins="*")  # Allow all origins, adjust if needed

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
    Bcrypt(app)
    models.db.init_app(app)
    Migrate(app, models.db)
    JWTManager(app)
    api = Api(app)

    # Register API routes
    initialize_routes(api)

    # Initialize SocketIO with app
    socketio.init_app(app)

    return app

# --------- Background: LND Invoice Streaming ---------
from services.lnd_service import stream_invoices, mark_payment_settled # Adjust path if needed

def invoice_callback(invoice):
    """Called when an invoice is settled; emits invoice event and updates payment."""
    payment_hash = invoice.r_hash.hex()

    # Update payment status, wallet balance and notify clients
    mark_payment_settled(payment_hash, socketio)

    # Emit a general invoice settled event (optional additional info)
    socketio.emit("invoice_settled", {
        "payment_hash": payment_hash,
        "memo": invoice.memo,
        "amount": invoice.amt_paid_sat,
        "settled": True
    })

def start_invoice_stream():
    """Start LND invoice subscription in a background thread."""
    thread = threading.Thread(target=stream_invoices, args=(invoice_callback,socketio))
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
        join_room(user_id)
        print(f"User {user_id} joined room")

@socketio.on('leave')
def on_leave(data):
    user_id = data.get('user_id')
    if user_id:
        leave_room(user_id)
        print(f"User {user_id} left room")

# --------- Run the App ---------
if __name__ == '__main__':
    app = create_app()
    start_invoice_stream()
    socketio.run(app, host='0.0.0.0', port=5000)

# import os
# from flask import Flask
# from flask_migrate import Migrate
# from flask_restful import Api
# from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager
# from config.config import DevelopmentConfig, ProductionConfig
# from routers import initialize_routes
# from dotenv import load_dotenv
# import models

# load_dotenv()

# def create_app():
#     app = Flask(__name__)

#     # Select configuration based on FLASK_ENV
#     env = os.getenv('FLASK_ENV', 'development')
#     if env == 'development':
#         app.config.from_object(DevelopmentConfig)
#     elif env == 'production':
#         app.config.from_object(ProductionConfig)
#     else:
#         raise ValueError(f"Invalid FLASK_ENV value: {env}")

#     # Initialize extensions
#     CORS(app)
#     bcrypt = Bcrypt(app)
#     models.db.init_app(app)
#     migrate = Migrate(app, models.db)
#     jwt = JWTManager(app)
#     api = Api(app)

#     # Register routes
#     initialize_routes(api)

#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(host='0.0.0.0', port=5000)

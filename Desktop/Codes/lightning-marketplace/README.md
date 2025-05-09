# ⚡ Lightning Marketplace

**Lightning Marketplace** is a secure, role-based e-commerce platform that enables users to buy and sell products using Bitcoin via the Lightning Network. It includes escrow protection for safe transactions, JWT-based authentication, and RESTful APIs for integration with web or mobile frontends.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#️-setup-instructions)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✅ Features

| Feature                        | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| **User Registration/Login**   | Secure user onboarding for buyers, sellers, and admins.                    |
| **JWT Authentication**        | Token-based access to protect backend routes.                             |
| **Role-Based Access Control** | Different permissions for buyers, sellers, and admins.                    |
| **Product Management**        | Sellers can create, read, update, and delete products.                    |
| **Cart System**               | Users can add multiple items before checkout.                             |
| **Order Placement + Escrow**  | Escrow logic ensures both parties are protected during transactions.      |
| **Lightning Payment**         | Bitcoin payments handled via LND (Lightning Network Daemon).              |
| **RESTful API Resources**     | Clean and scalable API for frontend/mobile consumption.                   |
| **Admin Panel (Optional)**    | Manage users, view transactions, and oversee activity.                    |

---

## 🛠 Tech Stack

- **Backend:** Python + Flask
- **Authentication:** JWT (Flask-JWT-Extended)
- **Database:** PostgreSQL / SQLite (based on config)
- **Payments:** Lightning Network (via LND gRPC)
- **Frontend (optional):** React / Vue.js / Jinja
- **Dev Tools:** Docker (optional), Postman, Git

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lightning-marketplace.git
cd lightning-marketplace
2. Create a Virtual Environment & Install Dependencies
bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
3. Configure Environment Variables
bash
Copy
Edit
cp .env.example .env
# Then edit .env with your database URI, JWT_SECRET_KEY, and LND config
4. Run Migrations
bash
Copy
Edit
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
5. Start the Development Server
bash
Copy
Edit
flask run
🔌 API Endpoints
🔐 Authentication
POST /api/auth/login
Login and receive JWT token.

Request:

json
Copy
Edit
{
  "email": "user@example.com",
  "password": "yourPassword"
}
Response:

json
Copy
Edit
{
  "token": "your-jwt-token"
}
📦 Products
GET /api/products
Get all products.

POST /api/products (Seller Only)
Create a new product.

Body:

json
Copy
Edit
{
  "name": "Product Name",
  "price": 5000,
  "description": "Nice product"
}
🗂 Folder Structure
arduino
Copy
Edit
lightning-marketplace/
│
├── app/
│   ├── __init__.py
│   ├── models/
│   ├── routes/
│   ├── auth/
│   ├── payments/
│
├── migrations/
├── .env.example
├── requirements.txt
├── run.py
└── README.md
👥 Contributors
Grace Ayuma - Documentation Lead

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
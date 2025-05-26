#SatSoko Marketplace

SatSoko is a global, Bitcoin-powered marketplace built on top of the Lightning Network, enabling borderless peer-to-peer commerce without intermediaries. This project is inspired by BitMarket and provides a seamless experience for both buyers and sellers, leveraging the power of Bitcoin for instant, low-fee transactions.

Table of Contents
Features

Technologies Used

Getting Started

Project Structure

User Workflow

Buyer Journey

Seller Journey

Dual Role (Buyer & Seller)

Lightning Network Integration

Example User Journey

Backend Integration

Contributing

License

Features
User authentication (login/register)

Product browsing, search, and filtering

Shopping cart functionality

Seller dashboard with analytics

Product management (add, edit, delete)

Order tracking for buyers and sellers

Lightning wallet integration for instant Bitcoin payments

Responsive design for all devices

Technologies Used
Frontend: Next.js 14, React, TypeScript

Styling: Tailwind CSS, shadcn/ui components

State Management: React Context API

Authentication: Custom authentication with local storage (for demo purposes)

Routing: Next.js App Router

Getting Started
Prerequisites
Node.js 18.17.0 or later

npm or yarn

Installation
Clone the repository:

bash
git clone https://github.com/Mujojo03/BitMarket.git
cd BitMarket
Install dependencies:

bash
npm install
# or
yarn install
Run the development server:

bash
npm run dev
# or
yarn dev
Open your browser:

Visit http://localhost:3000

Project Structure
text
/app        - Next.js App Router pages and layouts
/components - Reusable React components
/contexts   - React Context providers
/lib        - Utility functions, types, and mock data
/public     - Static assets (images, icons, etc.)
User Workflow
Buyer Journey
Account Creation

Buyers must register (email, password, name) to purchase and track orders.

Email verification is required; no KYC for basic buying.

Wallet Connection

Lightning wallet connection required at checkout or via settings.

Supports QR code, Lightning address, or LNURL authentication.

Shopping

Browse products, add to cart, checkout, pay via Lightning, and track orders.

Seller Journey
Becoming a Seller

Any user can become a seller by completing a seller profile.

Must provide a Lightning address for payments.

Seller Dashboard

Manage products, orders, and view analytics.

Receive payments instantly to the Lightning address.

Dual Role (Buyer & Seller)
Users can buy and sell with a single account.

Switch between buyer and seller dashboards easily.

Unified reputation and ability to use earnings for purchases.

Lightning Network Integration
All payments are processed via the Lightning Network for speed and low fees.

Sellers must set a Lightning address to receive funds.

Buyers connect wallets via QR, address, or LNURL.

Example User Journey
Alice registers, connects her Muun wallet, buys a product, and then becomes a seller by adding her Lightning address and listing handmade items—all with the same account. She manages both buying and selling activities seamlessly.

Backend Integration
This frontend is designed to connect to a Flask backend. The API service functions in /lib/api-service.ts are structured for easy adaptation to your backend.

Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

License
MIT

Pushing to GitHub
Initialize git repository (if not already done):

bash
git init
Add all files to staging:

bash
git add .
Commit changes:

bash
git commit -m "Initial commit: SatSoko frontend"
Add remote repository:

bash
git remote add origin https://github.com/Mujojo03/BitMarket.git
Create and switch to the frontend-nextjs branch:

bash
git checkout -b frontend-nextjs
Push to GitHub:

bash
git push -u origin frontend-nextjs

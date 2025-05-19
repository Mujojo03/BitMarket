const express = require('express');
const { createInvoice, payInvoice, subscribeToInvoices } = require('./invoice');
const cors = require('cors');
require('dotenv').config();
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Dummy order list (in real case, this would come from a database)
const dummyOrders = [
    { itemName: "Digital Art #1", amount: 500, r_hash: "replace_with_real_hash_1" },
    { itemName: "Template Pack", amount: 700, r_hash: "replace_with_real_hash_2" },
];

// Seller API route to list orders
app.get('/api/seller/orders', (req, res) => {
    res.json(dummyOrders);
});
// Client map to keep track of connected clients
const clients = new Map();
// WebSocket connection to listen for invoice updates
// This is where we would normally connect to the Lightning node
// and listen for invoice updates. For now, we will simulate it.

//websocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (msg) => {
        try {
            const data = JSON.parse(msg);
            if (data.r_hash){
                clients.set(data.r_hash, ws);
                console.log(`Client subscribed to invoice with hash: ${data.r_hash}`);
            }
        } catch (err) {
            console.error('Invalid Message from Client:', err);
        }
    });
});

// Create Invoice endpoint (REST endpoint)
app.post('/create-invoice', async (req, res) => {
    const { amount } = req.body;
    try {
        const invoice = await createInvoice(amount);
        res.json(invoice);
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error creating invoice');
    }
});

// Pay Invoice endpoint (REST endpoint)
app.post('/pay-invoice', async (req, res) => {
    const { payment_request } = req.body;
    if (!payment_request) {
        return res.status(400).json({ error: 'payment_request is required' });
    }
    try {
        const result = await payInvoice(payment_request);
        res.status(200).json(result);
    } catch (err) {
        console.error('Payment error:', err);
        res.status(500).json({ error: 'Payment failed', details: err.message });
    }
});

// Start server and subscribe to invoices
server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    subscribeToInvoices();
});

// app.listen(PORT, () => {
//     console.log(`Server listening at http://localhost:${PORT}`);
//     subscribeToInvoices(); // start payment listener
// });

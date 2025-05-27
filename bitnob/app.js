const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoute');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/invoices', invoiceRoutes);

module.exports = app;

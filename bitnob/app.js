const express = require('express');
const invoiceRoutes = require('./routes/invoiceRoute');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/invoices', invoiceRoutes);

module.exports = app;

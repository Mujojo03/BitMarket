const express = require('express');
const router = express.Router();
const { createInvoiceHandler } = require('../controllers/invoiceController');

// POST /api/invoices
router.post('/create', createInvoiceHandler);

module.exports = router;

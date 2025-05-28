const { createLightningInvoice } = require('../services/bitnobService');

async function createInvoiceHandler(req, res) {
  try {
    const { satoshis, customerEmail, description } = req.body;

    const invoice = await createLightningInvoice({
      satoshis,
      customerEmail,
      description
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create invoice' });
  }
}

module.exports = {
  createInvoiceHandler,
};
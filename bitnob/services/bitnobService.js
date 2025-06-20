const httpClient = require('../utils/httpClient');

// 🔑  The correct sandbox endpoint for a Lightning invoice is
//     POST /v1/lightning/invoices  (Bitnob docs) :contentReference[oaicite:0]{index=0}
async function createLightningInvoice({ satoshis, customerEmail, description }) {
  const body = {
    amount: satoshis,          // sats to collect
    description,
    customerEmail,             // optional
  };

  const res = await httpClient.post('/lightning/invoices', body);
  return res.data;             // { invoice: { paymentRequest, invoiceUrl, ... } }
}

module.exports = { createLightningInvoice };

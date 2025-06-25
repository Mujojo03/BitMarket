const httpClient = require('../utils/httpClient');

async function createLightningInvoice(data) {
  const response = await httpClient.post('/wallets/ln/createinvoice', data);
  return response.data;
}

module.exports = {
  createLightningInvoice,
};

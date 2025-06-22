// src/api/payment.js
import axios from "axios";

// 🔐  IMPORTANT – expose only the *public* env var in the browser.
//     In CRA use REACT_APP_, in Vite use VITE_.
//     Never commit the real key to git!
const BITNOB_API_KEY = process.env.REACT_APP_BITNOB_API_KEY;
const BITNOB_BASE_URL  = "https://api-service.bitnob.co/api/v1";   // prod
// For sandbox / test use
// const BITNOB_BASE_URL  = "https://sandboxapi.bitnob.co/api/v1";

const bitnob = axios.create({
  baseURL: BITNOB_BASE_URL,
  headers: {
    Authorization : `Bearer ${BITNOB_API_KEY}`,
    Accept        : "application/json",
    "Content-Type": "application/json"
  }
});

/**
 * Create a Lightning invoice.
 * @param {number} satoshis
 * @param {string} customerEmail
 * @param {string} description
 * @returns {Promise<{paymentRequest: string, invoiceUrl: string}>}
 */
export async function createLightningInvoice({ satoshis, customerEmail, description }) {
  const res = await bitnob.post("/wallets/ln/createinvoice", {
    satoshis,
    customerEmail,
    description,
  });

  console.log("Bitnob API response:", res.data);

  // Now handle the real response
  const { request } = res.data.data;

  return {
    paymentRequest: request,
    invoiceUrl: `lightning:${request}`,
  };
}
require('dotenv').config();
const axios = require('axios');

const httpClient = axios.create({
  baseURL: 'https://sandboxapi.bitnob.co/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.BITNOB_API_KEY}`
  }
});

module.exports = httpClient;
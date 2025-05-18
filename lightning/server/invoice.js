const { Client } = require('@grpc/grpc-js');
const lnd = require('./grpc');
const bolt11 = require('bolt11');
const bobLnd = require('./bobGrpc');

// Create Invoice
async function createInvoice(amountSats) {
    return new Promise((resolve, reject) => {
        const request = {
            memo: "Test Invoice",
            value: amountSats
        };
        lnd.AddInvoice(request, (err, response) => {
            if (err) {
                return reject(err);
            }

            // Log the response for debugging
            console.log("invoice response:", response);

            //to return the payment request and r_hash
            resolve({
                payment_request: response.paymentRequest,
                r_hash: response.rHash
                    ? Buffer.from(response.rHash).toString('hex')
                    : null
            });
        });
    });
}

async function payInvoice(payment_request) {
  try {
    const decoded = bolt11.decode(payment_request);
    const memo = decoded.tags.find(tag => tag.tagName === 'description')?.data || 'No Memo';
    const amount = decoded.satoshis ? parseInt(decoded.satoshis) : 0;
    const paymentHashTag = decoded.tags.find(tag => tag.tagName === 'payment_hash');
    const paymentHash = paymentHashTag?.data;

    if (!paymentHash) {
      throw new Error('Invalid invoice: missing payment hash');
    }

    const response = await new Promise((resolve, reject) => {
      bobLnd.SendPaymentSync({ payment_request }, (err, response) => {
        if (err) return reject(err);
        if (response.payment_error) return reject(new Error(response.payment_error));
        resolve(response);
      });
    });

    const paidHash = response.payment_hash?.toString('hex') || paymentHash;

    return {
      message: 'Payment sent',
      paymentHash: paidHash,
      amount,
      memo,
    };
  } catch (err) {
    console.error('Payment error:', err);
    throw err;
  }
}


// Subscribe to Invoices
function subscribeToInvoices() {
    const call = lnd.SubscribeInvoices({});
    call.on('data', (invoice) => {
        console.log("Invoice update received:", invoice);
        if (invoice.settled) {
            if (invoice.r_hash) {
                const hash = Buffer.from(invoice.r_hash).toString('hex');
                console.log(`Invoice settled! ${invoice.memo}, hash: ${hash}`);

                const ws = Clients.get(hash);
                if (ws && ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ paid: true }));
                    Clients.delete(hash);
                }
            } else {
                console.warn("Missing r_hash on settled invoice:", invoice);
            }
        }
    });
}

module.exports = { createInvoice, payInvoice, subscribeToInvoices };

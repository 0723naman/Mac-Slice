export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txn } = req.query;

  // Validate the transaction ID format (starts with txn_ or trans_ depending on Paddle version)
  if (!txn || !txn.startsWith('txn_')) {
    return res.status(400).json({ error: 'Invalid transaction ID format.' });
  }

  // The secret Paddle Live API Key must be set in Vercel's Environment Variables
  const PADDLE_API_KEY = process.env.PADDLE_LIVE_API_KEY;

  if (!PADDLE_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: Missing Paddle API Key.' });
  }

  try {
    // Call Paddle API to get the transaction details
    const paddleRes = await fetch(`https://api.paddle.com/transactions/${txn}`, {
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!paddleRes.ok) {
      if (paddleRes.status === 404) {
        return res.status(404).json({ error: 'Transaction not found.' });
      }
      return res.status(paddleRes.status).json({ error: 'Failed to communicate with Paddle.' });
    }

    const data = await paddleRes.json();
    const transaction = data.data;

    // Check if the transaction is completed
    if (transaction.status === 'completed') {
      return res.status(200).json({ 
        success: true, 
        message: 'License verified.', 
        status: transaction.status,
        customer_id: transaction.customer_id
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: `Transaction is in status: ${transaction.status}. It must be completed to unlock Pro.` 
      });
    }

  } catch (error) {
    console.error('Error verifying transaction:', error);
    return res.status(500).json({ error: 'Internal server error during verification.' });
  }
}

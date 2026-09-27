export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txn } = req.query;

  if (!txn) {
    return res.status(400).json({ error: 'Invalid transaction ID format.' });
  }

  // --- RAZORPAY SUBSCRIPTIONS (sub_...) AND PAYMENTS (pay_...) ---
  if (txn.startsWith('sub_') || txn.startsWith('pay_')) {
    const RZP_KEY = process.env.RAZORPAY_KEY_ID;
    const RZP_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RZP_KEY || !RZP_SECRET) {
      return res.status(500).json({ error: 'Server misconfiguration: Missing Razorpay API Keys.' });
    }

    const auth = Buffer.from(`${RZP_KEY}:${RZP_SECRET}`).toString('base64');
    
    try {
      let url = `https://api.razorpay.com/v1/payments/${txn}`;
      if (txn.startsWith('sub_')) {
        url = `https://api.razorpay.com/v1/subscriptions/${txn}`;
      }

      const rzpRes = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!rzpRes.ok) {
        return res.status(404).json({ error: 'Transaction or Subscription not found in Razorpay.' });
      }

      const data = await rzpRes.json();
      
      // For payments, status should be 'captured'. For subscriptions, status should be 'active' or 'authenticated'
      if (data.status === 'captured' || data.status === 'active' || data.status === 'authenticated') {
        return res.status(200).json({ 
          success: true, 
          message: 'Razorpay License verified.', 
          status: data.status 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: `Razorpay status is: ${data.status}. It must be captured or active to unlock Pro.` 
        });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error verifying Razorpay.' });
    }
  }

  // --- PADDLE TRANSACTIONS (txn_...) ---
  if (txn.startsWith('txn_') || txn.startsWith('trans_')) {
    const PADDLE_API_KEY = process.env.PADDLE_LIVE_API_KEY;

    if (!PADDLE_API_KEY) {
      return res.status(500).json({ error: 'Server misconfiguration: Missing Paddle API Key.' });
    }

    try {
      const paddleRes = await fetch(`https://api.paddle.com/transactions/${txn}`, {
        headers: {
          'Authorization': `Bearer ${PADDLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!paddleRes.ok) {
        return res.status(404).json({ error: 'Transaction not found in Paddle.' });
      }

      const data = await paddleRes.json();
      const transaction = data.data;

      if (transaction.status === 'completed') {
        return res.status(200).json({ 
          success: true, 
          message: 'Paddle License verified.', 
          status: transaction.status
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: `Paddle transaction is in status: ${transaction.status}. It must be completed to unlock Pro.` 
        });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error verifying Paddle.' });
    }
  }

  return res.status(400).json({ error: 'Invalid ID format. Must start with txn_, pay_, or sub_' });
}

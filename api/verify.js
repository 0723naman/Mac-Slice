export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txn } = req.query;

  if (!txn) {
    return res.status(400).json({ error: 'Invalid transaction ID format.' });
  }

  // --- DODO PAYMENTS (pay_... or sub_...) ---
  if (txn.startsWith('pay_') || txn.startsWith('sub_')) {
    const DODO_KEY = process.env.DODO_PAYMENTS_API_KEY;

    if (!DODO_KEY) {
      return res.status(500).json({ error: 'Server misconfiguration: Missing Dodo Payments API Key.' });
    }
    
    try {
      let url = `https://api.dodopayments.com/payments/${txn}`;
      if (txn.startsWith('sub_')) {
        url = `https://api.dodopayments.com/subscriptions/${txn}`;
      }

      const dodoRes = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${DODO_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!dodoRes.ok) {
        return res.status(404).json({ error: 'Transaction or Subscription not found in Dodo Payments.' });
      }

      const data = await dodoRes.json();
      
      // For payments, status should be 'succeeded'. For subscriptions, status should be 'active'
      if (data.status === 'succeeded' || data.status === 'active' || data.status === 'paid' || data.status === 'captured') {
        return res.status(200).json({ 
          success: true, 
          message: 'Dodo Payments License verified.', 
          status: data.status 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: `Payment status is: ${data.status}. It must be successfully paid to unlock Pro.` 
        });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error verifying Dodo Payments.' });
    }
  }

  return res.status(400).json({ error: 'Invalid ID format. Must start with pay_ or sub_' });
}

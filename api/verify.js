import { createClient } from '@vercel/kv';

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const kv = kvUrl && kvToken ? createClient({ url: kvUrl, token: kvToken }) : null;

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txn, machineId } = req.query;

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
        
        // --- LICENSE BINDING LOGIC ---
        if (machineId && kv) {
          const claimedMachine = await kv.get(txn);
          
          if (claimedMachine) {
            // Already claimed by someone
            if (claimedMachine !== machineId) {
              return res.status(403).json({ 
                success: false, 
                error: 'This License Key has already been activated on another Mac. One license per machine.' 
              });
            }
          } else {
            // First time use! Claim it for this machine forever.
            await kv.set(txn, machineId);
          }
        } else if (machineId && !kv) {
          console.warn("Vercel KV or Upstash is not configured. License sharing prevention is currently inactive.");
        }

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

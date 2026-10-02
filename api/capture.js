import { createClient } from '@vercel/kv';

const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const kv = kvUrl && kvToken ? createClient({ url: kvUrl, token: kvToken }) : null;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    // Vercel serverless functions parse JSON automatically if Content-Type is application/json
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    const email = payload.email;
    const country = payload.country || 'Unknown';

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (kv) {
      // Add the email to a Redis Set named 'free_downloads'
      // SADD ensures that duplicates are automatically ignored
      await kv.sadd('free_downloads', email);
      await kv.hset('free_downloads_users', { [email]: country });
      
      return res.status(200).json({ success: true, message: 'Email saved successfully' });
    } else {
      console.warn("Vercel KV is not configured. Email not saved.");
      return res.status(500).json({ error: 'Database not configured' });
    }
  } catch (error) {
    console.error("Error saving email:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

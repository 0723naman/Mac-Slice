import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    // Vercel serverless functions parse JSON automatically if Content-Type is application/json
    const email = typeof body === 'string' ? JSON.parse(body).email : body.email;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (process.env.KV_REST_API_URL) {
      // Add the email to a Redis Set named 'free_downloads'
      // SADD ensures that duplicates are automatically ignored
      await kv.sadd('free_downloads', email);
      
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

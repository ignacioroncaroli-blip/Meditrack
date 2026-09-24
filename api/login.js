import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { email, password } = body || {};

  const payload = JSON.stringify({ email, password });
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXBxZ2FxbWVhZXZhaGt4dWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzE1NzUsImV4cCI6MjEwNTgwNzU3NX0.ELU0GkPT8oXrqqLZffwuVwcGzfbdfmY5WfGy389hkxU';

  return new Promise((resolve) => {
    const options = {
      hostname: 'lvipgqaqmeaevahkxuay.supabase.co',
      path: '/auth/v1/token?grant_type=password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (response.statusCode >= 400) {
            res.status(400).json({ error: json.error_description || 'Credenciales incorrectas' });
          } else {
            res.status(200).json(json);
          }
        } catch(e) {
          res.status(500).json({ error: 'Parse error: ' + e.message });
        }
        resolve();
      });
    });

    request.on('error', (e) => {
      res.status(500).json({ error: 'HTTPS error: ' + e.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let email, password;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    email = body.email;
    password = body.password;
  } catch(e) {
    return res.status(400).json({ error: 'Invalid JSON body: ' + e.message });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password requeridos' });
  }

  const SUPABASE_URL  = 'https://lvipgqaqmeaevahkxuay.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aXBxZ2FxbWVhZXZhaGt4dWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzE1NzUsImV4cCI6MjEwNTgwNzU3NX0.ELU0GkPT8oXrqqLZffwuVwcGzfbdfmY5WfGy389hkxU';

  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON
      },
      body: JSON.stringify({ email, password })
    });
    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: data.error_description || 'Credenciales incorrectas' });
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: 'Fetch error: ' + e.message });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const r = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'hello' })
    });
    const data = await r.json();
    return res.status(200).json({ ok: true, data });
  } catch(e) {
    return res.status(500).json({ error: 'Fetch error: ' + e.message, stack: e.stack });
  }
}

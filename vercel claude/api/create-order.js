module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { amount, currency = 'INR', receipt } = req.body || {};
  if (!amount || amount < 100) return res.status(400).json({ error: 'Invalid amount' });

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return res.status(500).json({ error: 'Missing Razorpay credentials' });

  try {
    const credentials = btoa(`${key_id}:${key_secret}`);
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      })
    });

    const order = await response.json();
    if (!response.ok) return res.status(500).json({ error: order.error?.description || 'Order failed' });
    res.status(200).json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

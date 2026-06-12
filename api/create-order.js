const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, currency = 'INR', receipt } = req.body;
  if (!amount || amount < 100) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await rzp.orders.create({ amount, currency, receipt });
    res.status(200).json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error('Create order error:', e);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

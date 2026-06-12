const crypto = require('crypto');
const admin = require('firebase-admin');

// Init Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !uid)
    return res.status(400).json({ error: 'Missing fields' });

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature)
    return res.status(400).json({ success: false, error: 'Signature mismatch' });

  // Mark user as paid in Firestore (3 years from now)
  try {
    const paidUntil = new Date();
    paidUntil.setFullYear(paidUntil.getFullYear() + 3);
    await admin.firestore().collection('users').doc(uid).set({
      isPaid: true,
      paidUntil: admin.firestore.Timestamp.fromDate(paidUntil),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Firestore error:', e);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

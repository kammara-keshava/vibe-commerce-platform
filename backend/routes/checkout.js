const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/checkout  { cartItems: [ {cartId, productId, qty} ], name, email }
router.post('/', (req, res) => {
  const { cartItems, name, email } = req.body;
  if (!Array.isArray(cartItems) || !name || !email) {
    return res.status(400).json({ error: 'cartItems, name, email required' });
  }

  // compute total server-side for safety
  const ids = cartItems.map(ci => ci.productId);
  if (ids.length === 0) return res.status(400).json({ error: 'cart empty' });

  const placeholders = ids.map(() => '?').join(',');
  db.all(`SELECT id, price FROM products WHERE id IN (${placeholders})`, ids, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });

    // map productId -> price
    const priceMap = {};
    products.forEach(p => priceMap[p.id] = p.price);

    let total = 0;
    for (const it of cartItems) {
      const price = priceMap[it.productId];
      if (!price) return res.status(400).json({ error: `Invalid productId ${it.productId}` });
      total += price * it.qty;
    }
    total = Number(total.toFixed(2));

    const receipt = {
      id: 'R' + Date.now(),
      name,
      email,
      total,
      items: cartItems,
      timestamp: new Date().toISOString()
    };

    // Clear cart (simple approach) — in a real app you'd archive order
    db.run('DELETE FROM cart', [], function (deleteErr) {
      if (deleteErr) console.error('Error clearing cart', deleteErr);
      res.json({ receipt });
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/cart  -> return items with product details + total
router.get('/', (req, res) => {
  const sql = `
    SELECT c.id as cartId, c.productId, c.qty, p.name, p.price
    FROM cart c
    JOIN products p ON p.id = c.productId
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    let total = 0;
    const items = rows.map(r => {
      const subtotal = Number((r.price * r.qty).toFixed(2));
      total += subtotal;
      return { cartId: r.cartId, productId: r.productId, name: r.name, price: r.price, qty: r.qty, subtotal };
    });
    total = Number(total.toFixed(2));
    res.json({ items, total });
  });
});

// POST /api/cart  -> add { productId, qty }
router.post('/', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty <= 0) return res.status(400).json({ error: 'productId and qty>0 required' });

  // If item already in cart, increase qty
  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ?, addedAt = ? WHERE id = ?', [newQty, Date.now(), row.id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'updated', cartId: row.id, qty: newQty });
      });
    } else {
      db.run('INSERT INTO cart (productId, qty, addedAt) VALUES (?, ?, ?)', [productId, qty, Date.now()], function (err3) {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ message: 'added', cartId: this.lastID });
      });
    }
  });
});

// DELETE /api/cart/:id  -> remove cart item by cartId
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'removed' });
  });
});

// PATCH /api/cart/:id -> update qty (helpful)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  if (!qty || qty <= 0) return res.status(400).json({ error: 'qty>0 required' });
  db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'updated', id, qty });
  });
});

module.exports = router;

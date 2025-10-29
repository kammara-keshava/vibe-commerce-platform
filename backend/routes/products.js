const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products
router.get('/', (req, res) => {
  const sql = `SELECT id, name, price, description, image FROM products ORDER BY id`;
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('DB error in GET /api/products:', err);
      // Return JSON error so frontend won't try to .map() an HTML error page
      return res.status(500).json({ error: 'Failed to load products', details: err.message });
    }
    // Ensure rows is an array
    if (!Array.isArray(rows)) rows = [];
    res.json(rows);
  });
});

module.exports = router;

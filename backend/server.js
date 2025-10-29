// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const db = require('./db');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- Serve product images from frontend/public/images ----
// this makes http://localhost:4000/images/<file> return files from frontend/public/images
const imagesDir = path.join(__dirname, '../frontend/public/images');
if (fs.existsSync(imagesDir)) {
  app.use('/images', express.static(imagesDir));
  console.log(`Serving images from ${imagesDir} at /images`);
} else {
  console.warn(`Images dir not found: ${imagesDir}. Image requests to /images will 404.`);
}

// ---- API routes ----
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// simple root route so visiting http://localhost:4000 shows something friendly
app.get('/', (req, res) => {
  res.send('<h2>Vibe Commerce Mock API</h2><p>Use <a href="/api/products">/api/products</a></p>');
});

// health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// ---- Serve frontend build (production) ----
// If you build your frontend into frontend/dist, Express will serve it.
// This makes the app workable as a single deployable unit.
const distDir = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // any non-API route should serve index.html so client-side routing works
  app.get('*', (req, res) => {
    // don't override API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log(`Serving frontend build from ${distDir}`);
} else {
  console.log(`No frontend build found at ${distDir}. Frontend dev server should be used in development.`);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

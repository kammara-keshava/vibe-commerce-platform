// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecom.db');
console.log('Opening/creating DB at', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open DB', err);
  } else {
    console.log('SQLite DB opened OK');
  }
});

// Use serialize to ensure statements run in order
db.serialize(() => {
  // create products table (if missing)
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT
    );`,
    (err) => {
      if (err) console.error('Error creating products table:', err);
      else console.log('Ensured products table exists');
    }
  );

  // create cart table (if missing)
  db.run(
    `CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      addedAt INTEGER NOT NULL,
      FOREIGN KEY(productId) REFERENCES products(id)
    );`,
    (err) => {
      if (err) console.error('Error creating cart table:', err);
      else console.log('Ensured cart table exists');
    }
  );

  // After table creation statements above finish, check if products table is empty and seed
  db.get("SELECT COUNT(*) AS cnt FROM products", (err, row) => {
    if (err) {
      console.error('Error checking product count:', err);
      return;
    }
    if (row && row.cnt === 0) {
      const stmt = db.prepare("INSERT INTO products (id, name, price, description, image) VALUES (?, ?, ?, ?, ?)");
     const items = [
  [1, "Vibe T-shirt", 499.00, "Soft cotton tee", "/images/tshirt_1.png"],
  [2, "Vibe Sneakers", 2499.00, "Comfort walking shoes", "/images/sneakers_1.png"],
  [3, "Vibe Mug", 199.00, "Ceramic mug 350mL", "/images/mug_1.png"],
  [4, "Vibe Headphones", 3499.00, "Over-ear, noise isolating", "/images/headphones_1.png"],
  [5, "Vibe Backpack", 1299.00, "15L urban backpack", "/images/backpack_1.png"],
  [6, "Vibe Denim Jacket", 1799.00, "Classic denim jacket for casual wear", "/images/deniumjacket_1.png"],
  [7, "Vibe Leather Shoes", 2599.00, "Premium leather shoes for formal style", "/images/leathershoes_1.png"],
  [8, "Vibe Hartter Shoes", 2299.00, "Elegant and comfortable footwear", "/images/harttershoes_1.png"],
  [9, "Vibe Mule Sneakers", 1999.00, "Slip-on sneakers with comfort sole", "/images/mulesneakers_1.png"],
  [10, "Vibe Suite", 2999.00, "Formal office suit - classic fit", "/images/suite_1.png"],
  [11, "Vibe Skinmumma Cream", 499.00, "Hydrating face cream for smooth skin", "/images/skinmumma_1.png"],
  [12, "Vibe Ponds Skin Cream", 399.00, "Light moisturizing skin cream", "/images/ponds_skin_1.png"],
  [13, "Vibe Naturabisse Serum", 899.00, "Advanced skin hydration serum", "/images/naturabisse_1.png"],
  [14, "Vibe Yuri Perfume", 1599.00, "Long-lasting fragrance for everyday use", "/images/yuri_1.png"],
  [15, "Galaxy S23 Ultra", 94999.00, "200MP flagship smartphone", "/images/galaxy_s23_ultra.png"],
  [16, "Galaxy S23 Ultra Pink", 94999.00, "Flagship phone in pink variant", "/images/galaxy_s23_ultra_pink.png"],
  [17, "Galaxy S24 Ultra", 99999.00, "AI-powered premium smartphone", "/images/galaxy_s24_ultra.png"],
  [18, "Galaxy S24 Ultra Purple", 99999.00, "Galaxy flagship purple edition", "/images/galaxy_s24_ultra_purple.png"],
  [19, "Google Pixel 10", 89999.00, "Flagship Google phone with Tensor G4", "/images/google_pixel_10.png"],
  [20, "Google Pixel", 59999.00, "AI camera phone by Google", "/images/google_pixel.png"],
  [21, "iPhone 15 Black", 79999.00, "Apple iPhone 15 in black color", "/images/iphone_15_black.png"],
  [22, "iPhone 15 Cement", 79999.00, "Unique cement grey iPhone 15", "/images/iphone_15_cement.png"],
  [23, "iPhone 15 Skin", 79999.00, "Custom skin variant of iPhone 15", "/images/iphone_15_skin_color.png"],
  [24, "iPhone 17", 99999.00, "Next-gen iPhone with A18 Pro", "/images/iphone_17.png"],
  [25, "JBL Headphones", 3999.00, "Bass-boosted wireless headphones", "/images/jbl_headphones.png"],
  [26, "MacBook M1 Cement", 99999.00, "Apple MacBook Air M1 - Cement Edition", "/images/macbook_m1_cement.png"],
  [27, "MacBook M1 Orange", 99999.00, "Apple M1 in bright orange color", "/images/macbook_m1_orange.png"],
  [28, "MacBook M2 Cement", 129999.00, "Apple MacBook Pro M2 - Cement", "/images/macbook_m2_cement.png"]
];

      items.forEach(i => stmt.run(i, (e) => { if (e) console.error('Seed insert error', e); }));
      stmt.finalize((e) => {
        if (e) console.error('Finalize seed stmt error', e);
        else console.log('Seeded products');
      });
    } else {
      console.log('Products table not empty (count =', row ? row.cnt : 'unknown', ')');
    }
  });
});

module.exports = db;
// frontend/src/components/ProductCard.jsx
import React, { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product = {}, onAdd, disabled = false }) {
  // Resolve backend origin from env (VITE_API_URL or VITE_API_BASE) or fallback
  const configuredApi = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const apiOrigin = configuredApi.replace(/\/api\/?$/i, '');

  // Build image src helper -- returns absolute URL
  const buildImgSrc = (img) => {
    if (!img) return `${apiOrigin}/images/placeholder.png`;

    let imgPath = String(img).trim();

    // If it's already an absolute URL, use it
    if (/^https?:\/\//i.test(imgPath)) return imgPath;

    // Ensure leading slash
    if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;

    // Ensure it lives under /images/
    if (!imgPath.startsWith('/images/')) {
      imgPath = '/images' + (imgPath === '/' ? '' : imgPath);
    }

    return `${apiOrigin}${imgPath}`;
  };

  const [imgSrc, setImgSrc] = useState(buildImgSrc(product.image));

  // update when product.image changes
  useEffect(() => {
    setImgSrc(buildImgSrc(product.image));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.image]);

  // fallback if image 404s
  const handleImgError = () => {
    if (!imgSrc.includes('/placeholder')) {
      setImgSrc(`${apiOrigin}/images/placeholder.png`);
    }
  };

  // small debug, remove in production
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[ProductCard] image url:', imgSrc, 'product id:', product.id);
  }, [imgSrc, product.id]);

  // Add handler: call the passed onAdd (which can be already bound by parent)
  const handleAddClick = (e) => {
    e.preventDefault();
    if (!onAdd) return;
    try {
      // If parent expects product argument, pass it; if it's already bound, it will ignore.
      onAdd(product);
    } catch (err) {
      // If onAdd was bound as () => handleAdd(id) it will be called without args as well.
      try {
        onAdd();
      } catch (e) {
        // swallow
      }
    }
  };

  return (
    <div className="product-card card">
      <div className="img-wrap">
        <img
          src={imgSrc}
          alt={product.name || 'product'}
          className="product-img"
          loading="lazy"
          onError={handleImgError}
        />
        <button className="fav-btn" title="Add to wishlist" aria-label="Favorite">
          <FiHeart />
        </button>
      </div>

      <div className="prod-info card-body">
        <h3 className="prod-title">{product.name}</h3>
        <p className="desc">{product.description}</p>

        <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="price">₹{Number(product.price || 0).toFixed(2)}</div>
          </div>

          <div>
            <button
              className="add-btn"
              onClick={handleAddClick}
              disabled={disabled}
              aria-disabled={disabled}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

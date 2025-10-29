// frontend/src/components/Footer.jsx
import React from "react";
import "./Footer.css";

export default function Footer() {
  const columns = [
    {
      title: "ABOUT",
      items: ["Contact Us", "About Us", "Careers", "Stories", "Press", "Corporate Information"],
    },
    {
      title: "HELP",
      items: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"],
    },
    {
      title: "CONSUMER POLICY",
      items: ["Cancellation & Returns", "Terms Of Use", "Security", "Privacy", "Sitemap"],
    },
  ];

  return (
    <footer className="vc-footer" role="contentinfo">
      <div className="vc-footer-top">
        <div className="vc-footer-container">
          <div className="vc-footer-columns">
            {columns.map((col, idx) => (
              <div className="vc-footer-col" key={idx}>
                <h4 className="vc-footer-col-title">{col.title}</h4>
                <ul className="vc-footer-list">
                  {col.items.map((it, i) => (
                    <li key={i}>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="vc-footer-col vc-footer-contact">
              <h4 className="vc-footer-col-title">Mail Us:</h4>
              <address className="vc-address">
                Vibe Commerce Pvt Ltd,<br />
                Example Building, Sample Road,<br />
                Hyderabad, Telangana - 500000
              </address>

              <h4 className="vc-footer-col-title" style={{ marginTop: 18 }}>
                Social:
              </h4>
              <div className="vc-socials" aria-label="social links">
                {/* minimal inline SVG icons */}
                <a href="#" aria-label="facebook" onClick={(e) => e.preventDefault()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12.1C22 6.5 17.5 2 12 2S2 6.5 2 12.1C2 17.1 5.7 21.3 10.5 22v-7.1H8v-2.8h2.5V9.7c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.8l-.4 2.8H15v7.1c4.8-.7 8.5-4.9 8.5-9.9z" fill="currentColor" />
                  </svg>
                </a>
                <a href="#" aria-label="twitter" onClick={(e) => e.preventDefault()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M22 5.9c-.6.3-1.2.6-1.9.7.7-.5 1.2-1.2 1.4-2-.7.4-1.4.7-2.2.9C18.9 5 18 4.5 17 4.5c-1.8 0-3.2 1.6-2.9 3.3C11.5 7.6 9.1 6.1 7.5 4.1c-.9 1.6-.1 3.8 1.6 4.8-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 3.1 2.6 3.4-.5.1-1.1.2-1.6.1.5 1.7 2 2.8 3.6 2.8-1.3 1-3 1.6-4.5 1.6H6c2 1.2 4.4 1.9 6.9 1.9 8.3 0 12.9-6.8 12.9-12.8v-.6c.9-.6 1.6-1.4 2.2-2.2-.8.4-1.6.7-2.5.8z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" aria-label="youtube" onClick={(e) => e.preventDefault()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M23 7s-.2-1.7-.8-2.4c-.7-.9-1.6-.9-2-1C16.6 3.1 12 3.1 12 3.1s-4.6 0-7.2.5c-.4 0-1.3.1-2 1C2.2 5.3 2 7 2 7S2 8.9 2.4 10.1c.3 1 1 2.1 2 2.4 1.4.5 6.6.5 6.6.5s4.6 0 7.2-.5c.4 0 1.3-.1 2-1 .6-.7.8-2.4.8-2.4s.2-1.9-.8-2.9zM10 15V9l5 3-5 3z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" aria-label="instagram" onClick={(e) => e.preventDefault()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 7.6A4.4 4.4 0 1 0 16.4 14 4.4 4.4 0 0 0 12 9.6zm5.2-3.6a1.04 1.04 0 1 0 1.04 1.04A1.04 1.04 0 0 0 17.2 6z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="vc-footer-col vc-footer-office">
              <h4 className="vc-footer-col-title">Registered Office Address:</h4>
              <p className="vc-office">
                Vibe Commerce Pvt Ltd,<br />
                Example Building, Sample Road,<br />
                Hyderabad, Telangana 500000<br />
                Telephone: <a href="tel:+910000000000">000-000-0000</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="vc-footer-bottom">
        <div className="vc-footer-container bottom-grid">
          <div className="vc-bottom-left">
            <div className="vc-bottom-links">
              <span className="vc-bottom-item">Become a Seller</span>
              <span className="vc-bottom-item">Advertise</span>
              <span className="vc-bottom-item">Gift Cards</span>
              <span className="vc-bottom-item">Help Center</span>
            </div>
          </div>

          <div className="vc-bottom-center">
            <div className="vc-copyright">© {new Date().getFullYear()} Vibe Commerce</div>
          </div>

          <div className="vc-bottom-right">
            <div className="vc-payment-row">
              <img src="/images/pay_visa.png" alt="Visa" />
              <img src="/images/pay_mastercard.png" alt="Mastercard" />
              <img src="/images/pay_paypal.png" alt="PayPal" />
              <img src="/images/pay_cod.png" alt="Cash on Delivery" />
              <img src="/images/pay_rupay.png" alt="Rupay" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

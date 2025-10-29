import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import Modal from "react-modal";
Modal.setAppElement("#root");
Modal.defaultStyles.overlay.zIndex = 9999;

const container = document.getElementById('root');
if (!container) {
  throw new Error('No root element found. Make sure index.html has <div id="root"></div>');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from 'react';
import { IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#A64900', color: 'white', padding: '20px 0', borderRadius:'20px' }}>
      <div className="footer-content" style={{ textAlign: 'center' }}>
        <div className="footer-links" style={{ marginBottom: '10px' }}>
          {/* Íconos de redes sociales */}
          <IconButton href="https://www.facebook.com" target="_blank" style={{ color: 'white' }}>
            <Facebook />
          </IconButton>
          <IconButton href="https://www.instagram.com" target="_blank" style={{ color: 'white' }}>
            <Instagram />
          </IconButton>
          <IconButton href="https://www.twitter.com" target="_blank" style={{ color: 'white' }}>
            <Twitter />
          </IconButton>
        </div>

        {/* Copyright */}
        <div style={{ marginTop: '10px' }}>
          <p>© 2024 Seminario UADE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

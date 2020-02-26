import React from 'react';
import { Link } from 'react-router';

import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <Link to="/about-us" className="footer_link">
      About us
    </Link>
    <Link to="/terms-and-conditions" className="footer_link">
      Terms and conditions
    </Link>
    <Link to="privacy-and-policy" className="footer_link">
      Privacy and policy
    </Link>
  </footer>
);

export default Footer;

import React from 'react';
import './styles/Footer.css';
import { Link } from 'react-router-dom'; 

const Footer = () => (
    <footer className="footer">
        <p>© 2024 Akakçe Kara Gün İçindir</p>
        <Link to="/faq" className="footer-link">SSS</Link>
        
    </footer>
);

export default Footer;

import React from 'react';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="simple-footer">
      <div className="footer-content">
         
         {/* Başlıq */}
         <div className="footer-header">
            VOLPE <ArrowUpRight className="arrow-icon" size={20} />
         </div>

         {/* Mətn */}
         <p className="footer-subtext">
            Dizayn və animasiya layihələrimi izləmək üçün sosial media 
            hesablarına keçid edə bilərsiniz.
         </p>

         {/* Sosial Linklər */}
         <div className="footer-social-icons">
            <a 
              href="https://www.instagram.com/bysenann/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              <Instagram size={20} />
            </a>

            <a 
              href="https://www.linkedin.com/in/sanan-hasanzada-84793a358/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              <Linkedin size={20} />
            </a>

            <a 
              href="https://www.behance.net/gallery/229721201/IMTAHAN-%282D-ANIMATION%29" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn behance-btn"
            >
              Bē
            </a>
         </div>

         {/* Copyright */}
         <div className="footer-copyright">
            &copy; 2025 Sənan Həsənzadə. Bütün hüquqlar qorunur.
         </div>

      </div>
    </footer>
  );
};

export default Footer;
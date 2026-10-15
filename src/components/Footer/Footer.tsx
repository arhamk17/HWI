import Link from 'next/link';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <h3 className="type-heading-2 text-primary">HACK WITH INDIA</h3>
            <p className="type-body-small text-tertiary">BVUDET-NM Chapter</p>
            <p className="type-body-small text-tertiary footer__parent">A chapter of HackWithIndia</p>
          </div>
          
          <div className="footer__links">
            <div className="footer__social">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">DISCORD</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">X</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="type-label text-secondary hover-accent">GITHUB</a>
            </div>
            
            <div className="footer__nav">
              <Link href="/" className="type-label text-tertiary hover-accent">HOME</Link>
              <Link href="/team" className="type-label text-tertiary hover-accent">TEAM</Link>
              <Link href="/events" className="type-label text-tertiary hover-accent">EVENTS</Link>
              <Link href="/gallery" className="type-label text-tertiary hover-accent">GALLERY</Link>
              <Link href="/register" className="type-label text-tertiary hover-accent">JOIN</Link>
            </div>
          </div>
        </div>
        
        <div className="footer__divider"></div>
        
        <div className="footer__bottom">
          <p className="type-body-small text-tertiary">
            © {currentYear} Hack With India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

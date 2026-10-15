'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { scrollBus } from '@/lib/scrollBus';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import './Navigation.css';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Teams', href: '/team' },
  { label: 'Join', href: '/join' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // If not on homepage, always show navbar
    if (pathname !== '/') {
      setIsVisible(true);
      return;
    }

    const unsubscribe = scrollBus.subscribe((scrollY) => {
      setIsVisible(scrollY > window.innerHeight * 0.4);
    });

    return () => unsubscribe();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogoEnter = () => {
    whatWeDoStore.setEnvironment('orbital');
  };

  const handleLogoLeave = () => {
    whatWeDoStore.reset();
  };

  return (
    <>
      <nav className={`navbar ${isVisible ? 'navbar--visible' : ''}`}>
        <div className="navbar__container">
          <Link
            href="/"
            className="navbar__logo"
            onClick={closeMenu}
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            aria-label="HWI Home"
            data-cursor="link"
            data-cursor-label="HOME"
          >
            <span className="navbar__logo-text">HWI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar__desktop-links">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`navbar__desktop-link ${isActive ? 'navbar__desktop-link--active' : ''}`}
                  data-cursor="link"
                  data-cursor-label={item.label.toUpperCase()}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="navbar__actions">
            <Link
              href="/join"
              className="navbar__cta-btn magnetic-btn"
              data-cursor="link"
              data-cursor-label="JOIN"
            >
              Join Us
            </Link>
            <button
              className="navbar__toggle"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <div className={`nav-overlay ${isOpen ? 'nav-overlay--open' : ''}`}>
        <button
          className="nav-overlay__close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={32} />
        </button>

        <div className="nav-overlay__content">
          <div className="nav-overlay__links">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className="nav-overlay__link"
                onClick={closeMenu}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-overlay__social">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              Discord
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              GitHub
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

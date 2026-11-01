'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Calendar,
  Users,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';
import { scrollBus } from '@/lib/scrollBus';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import './Navigation.css';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Sparkles },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Teams', href: '/team', icon: Users },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Floating pill sliding highlight state & refs
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Calculate active index based on current route
  const activeIndex = NAV_ITEMS.findIndex((item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  });

  // Update sliding indicator position & width
  const updateIndicator = useCallback(() => {
    const targetIdx =
      hoveredIndex !== null
        ? hoveredIndex
        : activeIndex !== -1
        ? activeIndex
        : null;

    if (targetIdx !== null && itemRefs.current[targetIdx]) {
      const el = itemRefs.current[targetIdx];
      if (el && el.offsetWidth > 0) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
        setIsReady(true);
        return;
      }
    }

    setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
  }, [hoveredIndex, activeIndex]);

  // Recalculate on route change or hover change
  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator]);

  // Ensure indicator settles after fonts/layout resolve
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicator();
    }, 60);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        updateIndicator();
      });
    }

    return () => clearTimeout(timer);
  }, [updateIndicator, pathname]);

  // Navbar visibility logic: on home page, appears after 40vh scroll; on subpages, always visible
  useEffect(() => {
    if (pathname !== '/') {
      setIsVisible(true);
      return;
    }

    const unsubscribe = scrollBus.subscribe((scrollY) => {
      setIsVisible(scrollY > window.innerHeight * 0.4);
    });

    return () => unsubscribe();
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
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
          {/* Logo badge with ambient crimson halo */}
          <Link
            href="/"
            prefetch={true}
            className="navbar__logo"
            onClick={closeMenu}
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            aria-label="HWI Home"
            data-cursor="link"
            data-cursor-label="HOME"
          >
            <Image
              src="/hwi-bvudet-logo.png"
              alt="HackWithIndia BVUDET-NM"
              className="navbar__logo-image"
              width={40}
              height={40}
              draggable={false}
            />
          </Link>

          {/* Floating Pill Navigation with Sliding Highlight */}
          <div
            className="navbar__pill-track"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Animated Sliding Highlight Pill */}
            <div
              className={`navbar__pill-indicator ${
                isReady ? 'navbar__pill-indicator--animated' : ''
              }`}
              style={{
                transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
              aria-hidden="true"
            />

            {/* Navigation Tabs */}
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`navbar__pill-link ${
                    isActive ? 'navbar__pill-link--active' : ''
                  } ${isHovered ? 'navbar__pill-link--hovered' : ''}`}
                  data-cursor="link"
                  data-cursor-label={item.label.toUpperCase()}
                >
                  <span className="navbar__pill-icon">
                    <Icon size={15} strokeWidth={2.2} />
                  </span>
                  <span className="navbar__pill-label">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Registration CTA + Mobile Toggle */}
          <div className="navbar__actions">
            <Link
              href="/join"
              prefetch={true}
              className="navbar__cta-btn magnetic-btn"
              data-cursor="link"
              data-cursor-label="REGISTER"
            >
              Register
            </Link>
            <button
              className="navbar__toggle"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
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
          <X size={26} />
        </button>

        <div className="nav-overlay__content">
          <div className="nav-overlay__links">
            {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeIndex === i;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  className={`nav-overlay__link ${
                    isActive ? 'nav-overlay__link--active' : ''
                  }`}
                  onClick={closeMenu}
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  <span className="nav-overlay__link-icon">
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <span className="nav-overlay__link-text">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="nav-overlay__social">
            <a
              href="https://www.instagram.com/hwi.bvudet_nm?exln=MTk5NDVrMDJtZ2d2Nw=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/hackwithindia-bvudet-nm-chapter/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

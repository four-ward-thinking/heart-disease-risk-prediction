import React, { useState, useEffect } from 'react';
import { HeartMark } from './HeartMark';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Assess', href: '#assess' },
    { label: 'Model', href: '#model' },
    { label: 'Data', href: '#data' },
    { label: 'Fairness', href: '#fairness' },
    { label: 'Research Pulse', href: '#pulse' },
    { label: 'Team', href: '#team' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(244, 240, 231, 0.96)' : 'var(--bone)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
        }}
      >
        {/* Wordmark with HeartMark */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: 'var(--ink)',
          }}
          aria-label="Four-Ward Home"
        >
          <HeartMark size={28} />
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Four-Ward
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '0.84rem',
                fontWeight: 500,
                color: 'var(--ink)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brass)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#assess"
            className="btn btn-primary"
            style={{ display: 'none' }}
            id="desktop-assess-cta"
          >
            Start assessment
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              border: '1px solid var(--line)',
              backgroundColor: 'var(--paper)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileMenuOpen ? (
                <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height) + var(--notice-height))',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bone)',
            zIndex: 99,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            borderTop: '1px solid var(--line)',
            overflowY: 'auto',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--ink)',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--line)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#assess"
            className="btn btn-primary"
            onClick={handleLinkClick}
            style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}
          >
            Start assessment
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-assess-cta {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};


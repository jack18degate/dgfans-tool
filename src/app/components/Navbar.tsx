'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Menu, X, Rocket, ExternalLink, Globe, ChevronDown } from 'lucide-react';
import { useI18n, LOCALES } from '../i18n';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useI18n();

  const NAV_ITEMS = [
    { href: '/tools', label: t.nav.compoundInterest, icon: TrendingUp, emoji: '📈' },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLocale = LOCALES.find(l => l.code === locale)!;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        {/* Logo */}
        <Link href="/tools" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <div className={styles.logoIcon}>⚡</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>DeGate</span>
            <span className={styles.logoSub}>Tools</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          <span className={styles.navLabel}>{t.nav.tools}</span>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.navEmoji}>{item.emoji}</span>
                <span className={styles.navText}>{item.label}</span>
                {isActive && <span className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          {/* Language Switcher */}
          <div className={styles.langWrapper} ref={langRef}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen(prev => !prev)}
            >
              <Globe size={14} />
              <span>{currentLocale.flag} {currentLocale.label}</span>
              <ChevronDown
                size={14}
                style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
              />
            </button>
            {langOpen && (
              <div className={styles.langMenu}>
                {LOCALES.map(l => (
                  <button
                    key={l.code}
                    className={`${styles.langItem} ${l.code === locale ? styles.langItemActive : ''}`}
                    onClick={() => { setLocale(l.code); setLangOpen(false); }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <a
            href="https://app.degate.com/?utm_source=walletanalyzer?s=jack18"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <Rocket size={14} />
            <span>{t.nav.turboRange}</span>
            <ExternalLink size={12} />
          </a>
          <span className={styles.footerCopy}>{t.nav.copyright}</span>
        </div>
      </nav>
    </>
  );
}

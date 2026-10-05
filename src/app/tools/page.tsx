'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import styles from './page.module.css';

export default function ToolsLandingPage() {
  const { locale, t } = useI18n();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(3000);
  const [isLoaded, setIsLoaded] = useState(false);

  const src = locale === 'it' ? '/landing/turborangeita.html' : '/landing/turborangeeng.html';

  // Get current theme from <html data-theme>
  const getTheme = useCallback(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    return 'dark';
  }, []);

  // Send theme to iframe
  const sendThemeToIframe = useCallback((theme: string) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({ type: 'theme-change', theme }, '*');
  }, []);

  // Resize iframe to fit content
  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc?.body) {
        const h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
        if (h > 200) setIframeHeight(h + 40);
      }
    } catch { /* cross-origin guard */ }
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);

    // Send current theme
    sendThemeToIframe(getTheme());

    // Resize after content loads (images, fonts, etc.)
    resizeIframe();
    const t1 = setTimeout(resizeIframe, 200);
    const t2 = setTimeout(resizeIframe, 800);
    const t3 = setTimeout(resizeIframe, 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [resizeIframe, sendThemeToIframe, getTheme]);

  // Watch for theme changes on <html> data-theme attribute
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      sendThemeToIframe(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also listen to custom themechange event
    const handleThemeChange = () => sendThemeToIframe(getTheme());
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, [sendThemeToIframe, getTheme]);

  // Reset state on locale change
  useEffect(() => {
    setIsLoaded(false);
  }, [locale]);

  return (
    <main className={styles.landingContainer}>
      {/* Loader */}
      {!isLoaded && (
        <div className={styles.landingLoader}>
          <div className={styles.landingSpinner} />
        </div>
      )}

      {/* Landing page iframe */}
      <iframe
        ref={iframeRef}
        key={src}
        src={src}
        className={`${styles.landingIframe} ${isLoaded ? styles.landingIframeVisible : ''}`}
        style={{ height: `${iframeHeight}px` }}
        onLoad={handleLoad}
        title="Turbo Range Guide"
        sandbox="allow-scripts allow-same-origin"
      />

      {/* CTA Buttons */}
      {isLoaded && (
        <div className={styles.landingCta}>
          {/* Calcolatore Interesse e Turbo Range Analysis nascosti temporaneamente */}
          <a
            href="/onchainstocks"
            className={`${styles.landingBtn} ${styles.landingBtnStocks}`}
          >
            <div className={`${styles.landingBtnIconBox} ${styles.landingBtnIconBoxViolet}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="6" y1="21" x2="6" y2="10" />
                <line x1="10" y1="21" x2="10" y2="10" />
                <line x1="14" y1="21" x2="14" y2="10" />
                <line x1="18" y1="21" x2="18" y2="10" />
                <polygon points="12 2 2 7 22 7 12 2" />
              </svg>
            </div>
            <span className={styles.landingBtnText}>
              <span className={styles.landingBtnTitle}>
                {t.nav.onchainStocks || 'Azioni On-Chain'}
              </span>
              <span className={styles.landingBtnDesc}>
                {locale === 'it'
                  ? 'Guida completa alle azioni ed ETF on-chain in self-custody'
                  : 'Complete guide to tokenized stocks & ETFs in self-custody'}
              </span>
            </span>
            <span className={`${styles.landingBtnArrow} ${styles.landingBtnArrowViolet}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </span>
          </a>
        </div>
      )}
    </main>
  );
}

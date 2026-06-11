'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import styles from './page.module.css';

export default function ToolsLandingPage() {
  const { locale } = useI18n();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(3000);
  const [isLoaded, setIsLoaded] = useState(false);

  const isItalian = locale === 'it';
  const src = isItalian ? '/landing/turborangeita.html' : '/landing/turborangeeng.html';

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
  }, [isItalian]);

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
          <a href="/compound" className={styles.landingBtn}>
            <div className={styles.landingBtnIconBox}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2"/>
                <line x1="8" x2="16" y1="6" y2="6"/>
                <line x1="16" x2="16" y1="14" y2="18"/>
                <path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/>
                <path d="M12 14h.01"/><path d="M8 14h.01"/>
                <path d="M12 18h.01"/><path d="M8 18h.01"/>
              </svg>
            </div>
            <span className={styles.landingBtnText}>
              <span className={styles.landingBtnTitle}>
                {isItalian ? 'Calcolatore di Interesse Composto' : 'Compound Interest Calculator'}
              </span>
              <span className={styles.landingBtnDesc}>
                {isItalian
                  ? 'Simula la crescita del capitale con i tassi reali dei pool Turbo Range'
                  : 'Simulate capital growth with real rates from Turbo Range pools'}
              </span>
            </span>
            <span className={styles.landingBtnArrow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </span>
          </a>
          <a
            href="https://dgfans.io/turbo"
            className={`${styles.landingBtn} ${styles.landingBtnSecondary}`}
          >
            <div className={`${styles.landingBtnIconBox} ${styles.landingBtnIconBoxGreen}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className={styles.landingBtnText}>
              <span className={styles.landingBtnTitle}>Turbo Range Analysis</span>
              <span className={styles.landingBtnDesc}>
                {isItalian
                  ? 'Analisi avanzata della liquidità e simulazione rendimenti'
                  : 'Advanced liquidity analysis and yield simulation'}
              </span>
            </span>
            <span className={`${styles.landingBtnArrow} ${styles.landingBtnArrowGreen}`}>
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

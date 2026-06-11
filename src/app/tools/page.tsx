'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import styles from './page.module.css';

export default function ToolsLandingPage() {
  const { locale } = useI18n();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(2000);
  const [isLoaded, setIsLoaded] = useState(false);

  const isItalian = locale === 'it';
  const src = isItalian ? '/landing/turborangeita.html' : '/landing/turborangeeng.html';

  // Resize iframe to fit content
  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc?.body) {
        const h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
        if (h > 100) {
          setIframeHeight(h);
        }
      }
    } catch {
      // cross-origin fallback — shouldn't happen for same-origin
    }
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    // Resize immediately and then again after a short delay for images/fonts
    resizeIframe();
    const t1 = setTimeout(resizeIframe, 300);
    const t2 = setTimeout(resizeIframe, 1000);
    const t3 = setTimeout(resizeIframe, 3000);

    // Also listen for resize events inside iframe
    const iframe = iframeRef.current;
    try {
      const iframeWindow = iframe?.contentWindow;
      if (iframeWindow) {
        iframeWindow.addEventListener('resize', resizeIframe);
        // Observe mutations for dynamic content
        const doc = iframe?.contentDocument || iframeWindow.document;
        if (doc?.body) {
          const observer = new MutationObserver(resizeIframe);
          observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
        }
      }
    } catch { /* ignore */ }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [resizeIframe]);

  // Reset loaded state when locale changes
  useEffect(() => {
    setIsLoaded(false);
  }, [isItalian]);

  return (
    <main className={styles.landingContainer}>
      {/* Loading state */}
      {!isLoaded && (
        <div className={styles.landingLoader}>
          <div className={styles.landingSpinner} />
        </div>
      )}

      {/* Iframe with landing page */}
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
            <span className={styles.landingBtnIcon}>📊</span>
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
            <span className={styles.landingBtnArrow}>→</span>
          </a>
          <a
            href="https://dgfans.io/turbo"
            className={`${styles.landingBtn} ${styles.landingBtnSecondary}`}
          >
            <span className={styles.landingBtnIcon}>⚡</span>
            <span className={styles.landingBtnText}>
              <span className={styles.landingBtnTitle}>Turbo Range Analysis</span>
              <span className={styles.landingBtnDesc}>
                {isItalian
                  ? 'Analisi avanzata della liquidità e simulazione rendimenti'
                  : 'Advanced liquidity analysis and yield simulation'}
              </span>
            </span>
            <span className={styles.landingBtnArrow}>→</span>
          </a>
        </div>
      )}
    </main>
  );
}

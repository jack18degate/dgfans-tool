'use client';

import { useEffect, useState, useRef } from 'react';
import { useI18n } from '../i18n';
import styles from './page.module.css';

// ── Extract just the <body> innerHTML and the <script> content from a full HTML doc ──
function extractBodyAndScript(html: string): { body: string; script: string } {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : '';

  // Extract script content
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const script = scriptMatch ? scriptMatch[1] : '';

  // Remove the script from body
  const bodyWithoutScript = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  return { body: bodyWithoutScript, script };
}

// ── Rewrite relative asset paths to /public absolute paths ──
function rewriteAssetPaths(html: string): string {
  return html
    .replace(/src="DEGATE LOGO\.png"/g, 'src="/degate-logo-landing.png"')
    .replace(/src="Screenshot_2025-10-28_at_10\.50\.19\.png"/g, 'src="/turborange-screenshot.png"')
    .replace(/src="liquidity_provider_fee_story\.mp4"/g, 'src="/liquidity_provider_fee_story.mp4"');
}

export default function ToolsLandingPage() {
  const { locale } = useI18n();
  const [htmlContent, setHtmlContent] = useState<{ body: string; script: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which version to load based on locale
  const isItalian = locale === 'it';

  useEffect(() => {
    setIsLoading(true);
    const file = isItalian ? '/landing/turborangeita.html' : '/landing/turborangeeng.html';

    fetch(file)
      .then(res => res.text())
      .then(html => {
        const { body, script } = extractBodyAndScript(html);
        const rewrittenBody = rewriteAssetPaths(body);
        setHtmlContent({ body: rewrittenBody, script });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [isItalian]);

  // Execute scripts after HTML is injected
  useEffect(() => {
    if (htmlContent?.script && containerRef.current) {
      // Small delay to allow DOM to settle
      const timer = setTimeout(() => {
        try {
          // Create a new function from the script and execute it
          const fn = new Function(htmlContent.script);
          fn();
        } catch (e) {
          console.error('Error executing landing page script:', e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [htmlContent]);

  return (
    <main className={styles.landingContainer}>
      {isLoading ? (
        <div className={styles.landingLoader}>
          <div className={styles.landingSpinner} />
        </div>
      ) : htmlContent ? (
        <>
          <div
            ref={containerRef}
            className={styles.landingContent}
            dangerouslySetInnerHTML={{ __html: htmlContent.body }}
          />
          {/* CTA Buttons */}
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
        </>
      ) : (
        <div className={styles.landingError}>
          {isItalian ? 'Errore nel caricamento della pagina.' : 'Error loading page.'}
        </div>
      )}
    </main>
  );
}

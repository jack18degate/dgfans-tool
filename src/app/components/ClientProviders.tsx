'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '../i18n';
import Navbar from './Navbar';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </I18nProvider>
  );
}

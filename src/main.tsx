/**
 * Entry point. Four providers, in this order:
 *   AppTheme      — palette, typography and every component override
 *   ToastProvider — useToast() for every page
 *   BrowserRouter — routing
 *   App           — the shell and its routes
 *
 * The router's basename comes from Vite's BASE_URL so the same build works
 * root-hosted and under a sub-path (GitHub Pages serves a project site at
 * `/<repo>/`). Without it every route resolves one level too high and the app
 * renders its 404 on load.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppTheme } from '@kit/theme';
import { ToastProvider } from '@kit/components/feedback';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <AppTheme defaultMode="dark">
      <ToastProvider>
        {/* Vite gives BASE_URL a trailing slash; react-router wants it without. */}
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </AppTheme>
  </StrictMode>,
);

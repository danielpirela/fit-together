import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './presentation/styles/theme.css';
import App from './App';
import { MotionProvider } from './presentation/motion/MotionProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ── Dark Mode Boot — No FOUC ─────────────────────────────────────────────────
// Set dark before first paint to avoid white flash. Persisted to localStorage
// so user preference survives HMR. Comment out to disable dark mode.
const STORAGE_KEY = 'fit-together:theme';
document.documentElement.dataset.theme =
  localStorage.getItem(STORAGE_KEY) ?? 'dark';
// ────────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MotionProvider>
          <App />
        </MotionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

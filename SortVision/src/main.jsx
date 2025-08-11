import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { AudioProvider } from "./context/AudioContext";


// Lazy load App component for better initial load time
const App = lazy(() => import('./App.jsx'));

// Lazy load analytics components with more efficient dynamic imports
const SpeedInsights = lazy(() => 
  import('@vercel/speed-insights/react')
    .then(module => ({ default: module.SpeedInsights }))
    .catch((error) => {
      console.warn('Speed Insights failed to load:', error);
      return { default: () => null };
    })
);

// GitHub API debugging enabled in development mode
if (import.meta.env.DEV) {
  console.log('🔧 GitHub API debugging enabled. Check console for detailed feedback submission logs.');
}

const Analytics = lazy(() => 
  import('@vercel/analytics/react')
    .then(module => ({ default: module.Analytics }))
    .catch((error) => {
      console.warn('Analytics failed to load:', error);
      return { default: () => null };
    })
);

// Custom event handler for analytics
const beforeSend = (event) => {
  // Ignore events from algorithm testing pages
  if (event.url.includes('/algorithms/test')) {
    return null;
  }
  
  // Redact sensitive data from URLs
  const url = new URL(event.url);
  if (url.searchParams.has('token')) {
    url.searchParams.set('token', '[REDACTED]');
  }
  
  return {
    ...event,
    url: url.toString()
  };
};

// Render analytics if not a prerender
const shouldRenderAnalytics = !document.documentElement.hasAttribute('data-prerender');

// Simple loading component that doesn't cause layout shifts
const LoadingFallback = () => <div className="min-h-screen bg-slate-950"></div>;

// Use createRoot in an idle callback for non-critical initialization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AudioProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/algorithms/:algorithmName" element={<App />} />
              <Route path="/contributions/overview" element={<App />} />
              <Route path="/contributions/guide" element={<App />} />
              <Route path="/contributions/ssoc" element={<App />} />
              <Route path="/contributions" element={<App />} />
              <Route path="*" element={<App />} />
            </Routes>
          </AudioProvider>
        </Suspense>
        {shouldRenderAnalytics && (
          <Suspense fallback={null}>
            <SpeedInsights debug={import.meta.env.DEV} />
            <Analytics beforeSend={beforeSend} />
          </Suspense>
        )}
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
  }, { timeout: 100 }); // Short timeout to ensure it runs quickly but not during critical rendering
} else {
  // Fallback for browsers that don't support requestIdleCallback
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AudioProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/algorithms/:algorithmName" element={<App />} />
              <Route path="/contributions/overview" element={<App />} />
              <Route path="/contributions/guide" element={<App />} />
              <Route path="/contributions/ssoc" element={<App />} />
              <Route path="/contributions" element={<App />} />
              <Route path="*" element={<App />} />
            </Routes>
          </AudioProvider>
        </Suspense>
        {shouldRenderAnalytics && (
          <Suspense fallback={null}>
            <SpeedInsights debug={import.meta.env.DEV} />
            <Analytics beforeSend={beforeSend} />
          </Suspense>
        )}
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
}

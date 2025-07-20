import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

import React from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  t: (key: string) => string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div
          className={styles.errorBoundary}
          data-testid="error-boundary-fallback"
        >
          <h2 className={styles.title}>{t('ErrorBoundary.title')}</h2>
          <p className={styles.message}>
            {this.state.error?.message || t('ErrorBoundary.unknownError')}
          </p>
          <p>{t('ErrorBoundary.description')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import ReactDOM from 'react-dom';
import { type ReactNode } from 'react';
import { useEffect } from 'react';
import styles from './Modal.module.css';
import type { BaseProps } from '../../types/common';

const Modal = ({
  children,
  isOpen,
  actions = null,
  onClose = () => {},
  testId,
}: {
  children: ReactNode;
  isOpen: boolean;
  actions?: ReactNode;
  onClose?: () => void;
} & BaseProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const Content = (
    <div
      data-testid={testId}
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
    >
      <div data-testid={`${testId}-modal`} className={styles.modal}>
        <div
          data-testid={`${testId}-close`}
          className={styles.close}
          onClick={onClose}
        >
          X
        </div>
        <div data-testid={`${testId}-content`} className={styles.content}>
          {children}
        </div>
        {actions && (
          <div data-testid={`${testId}-actions`} className={styles.footer}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(Content, document.body);
};

export default Modal;

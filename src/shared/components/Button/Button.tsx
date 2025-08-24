import type { BaseProps } from '../../types/common';
import styles from './Button.module.css';
export const Button = ({
  children,
  onClick,
  className,
  testId,
  type = 'button',
  ...props
}: { children: React.ReactNode } & BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      data-testid={testId}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

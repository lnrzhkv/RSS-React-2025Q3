import React from 'react';
import styles from './Box.module.css';

interface Props {
  children: React.ReactNode;
  withShadow?: boolean;
  className?: string;
  testId?: string;
}
const Box: React.FC<Props> = ({
  children,
  className,
  withShadow = true,
  testId,
}) => {
  return (
    <div
      className={`${styles.box} ${withShadow ? styles.withShadow : ''} ${className ? className : ''}`}
      role="banner"
      data-testid={testId || 'box'}
    >
      {children}
    </div>
  );
};

export default Box;

import type { ReactNode } from 'react';
import styles from './FormElement.module.css';
import type { BaseProps } from '../../../types/common';
const FormElement = ({
  id,
  error,
  children,
  testId,
}: {
  id: string;
  error?: string;
  children?: ReactNode;
} & BaseProps) => {
  return (
    <>
      <div className={styles.formElement} data-testid={testId}>
        <label
          htmlFor={id}
          className={styles.formLabel}
          data-testid={`${testId}-label`}
        >
          {children}
        </label>
        {error && (
          <span data-testid={`${testId}-error`} className={styles.formError}>
            {error}
          </span>
        )}
      </div>
    </>
  );
};

export default FormElement;

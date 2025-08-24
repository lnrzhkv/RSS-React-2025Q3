import type { InputHTMLAttributes } from 'react';
import type { BaseProps } from '../../types/common';
import styles from './Input.module.css';
const Input = ({
  id,
  ref,
  placeholder,
  className,
  type = 'text',
  testId,
  value,
  onChange,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> &
  BaseProps & {
    ref?: React.RefObject<HTMLInputElement | null>;
    'data-testid'?: string;
  }) => {
  return (
    <input
      {...rest}
      value={value}
      onChange={onChange}
      id={id}
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`${styles.input} ${className}`}
      data-testid={testId || rest['data-testid']}
    />
  );
};

export default Input;

import React, { useEffect, useState, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';
import type { BaseFormElementProps } from '../FormTools/types';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  BaseFormElementProps & {
    selectRef?: React.RefObject<HTMLSelectElement | null>;
    options: string[];
    value?: string;
    defaultValue?: string;
    testId?: string;
  };

const Select: React.FC<SelectProps> = ({
  className = '',
  selectRef,
  id = '',
  options = [],
  testId,
  value,
  defaultValue,
  onChange,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) {
      setInternalValue(event.target.value);
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      {...rest}
      id={id}
      ref={selectRef}
      data-testid={testId}
      className={`${styles.select} ${className}`}
      value={value !== undefined ? value : internalValue}
      onChange={handleChange}
    >
      {options.map((option, index) => (
        <option data-testid={`${testId}-${index}`} key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;

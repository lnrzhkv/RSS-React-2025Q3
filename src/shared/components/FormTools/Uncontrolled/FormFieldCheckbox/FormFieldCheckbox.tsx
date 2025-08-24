import { type RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import styles from './FormFieldCheckbox.module.css';
import Input from '../../../Input/Input';

const FormFieldCheckboxInput = ({
  id,
  inputRef,
  error,
  label,
  testId,
  disabled,
  name,
  className,
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  error?: string;
  label?: string;
  disabled?: boolean;
  name?: string;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <div className={styles.checkboxWrapper}>
        <Input
          data-testid={`${id}-checkbox`}
          id={id}
          name={name}
          disabled={disabled}
          ref={inputRef}
          type="checkbox"
          className={`input-checkbox ${className}`}
          {...rest}
        />

        <div data-testid={`${id}-checkbox-label`} className="checkbox-label">
          {label}
        </div>
      </div>
    </FormElement>
  );
};

export default FormFieldCheckboxInput;

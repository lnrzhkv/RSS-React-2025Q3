import type { ChangeEventHandler } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import styles from './FormFieldCheckbox.module.css';
import Input from '../../../Input/Input';

const FormFieldCheckbox = ({
  id,
  checked,
  onChange,
  error,
  label,
  testId,
  disabled,
  name,
  className = '',
  ...rest
}: {
  checked?: boolean;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    ChangeEventHandler<HTMLInputElement>;
  error?: string;
  label?: string;
  testId?: string;
  disabled?: boolean;
  name?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
} & BaseFormElementProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <div className={styles.checkboxWrapper}>
        <Input
          data-testid={
            testId === 'accepted-terms-checkbox-wrapper'
              ? 'accepted-terms-checkbox'
              : testId || `${id}-checkbox`
          }
          id={id}
          checked={checked}
          onChange={handleChange}
          name={name}
          disabled={disabled}
          type="checkbox"
          className={`input-checkbox ${className}`}
          {...rest}
        />

        {label && (
          <div data-testid={`${id}-checkbox-label`} className="checkbox-label">
            {label}
          </div>
        )}
      </div>
    </FormElement>
  );
};

export default FormFieldCheckbox;

import type { ChangeEventHandler } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { InputHTMLAttributes } from 'react';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const InputPassword = ({
  placeholder = 'Enter password',
  className = '',
  id = '',
  testId = '',
  value,
  onChange,
  ...rest
}: {
  placeholder?: string;
  value?: string;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    ChangeEventHandler<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement> &
  BaseFormElementProps) => {
  return (
    <Input
      data-testid={testId}
      id={id}
      type="password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-password ${className}`}
      {...rest}
    />
  );
};

const FormFieldPassword = ({
  id,
  value,
  onChange,
  placeholder,
  error,
  testId,
  disabled,
  autoComplete,
  ...rest
}: {
  value?: string;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
  autoComplete?: 'current-password' | 'new-password';
} & BaseFormElementProps) => {
  const elementTestId = testId || `${id}-form-element`;
  return (
    <FormElement id={id} error={error} testId={elementTestId}>
      <InputPassword
        testId={`${id}-password`}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldPassword;

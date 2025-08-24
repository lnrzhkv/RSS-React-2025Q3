import { type RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { InputHTMLAttributes } from 'react';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const InputPassword = ({
  placeholder = 'Enter text',
  className = '',
  inputRef,
  id = '',
  testId = '',
  ...rest
}: {
  placeholder?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
} & InputHTMLAttributes<HTMLInputElement> &
  BaseFormElementProps) => {
  return (
    <Input
      data-testid={testId}
      id={id}
      ref={inputRef}
      type="password"
      placeholder={placeholder}
      className={`input-password ${className}`}
      {...rest}
    />
  );
};

const FormFieldPasswordInput = ({
  id,
  inputRef,
  placeholder,
  error,
  testId,
  disabled,
  autoComplete,
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: 'current-password' | 'new-password';
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <InputPassword
        testId={`${id}-password`}
        placeholder={placeholder}
        id={id}
        inputRef={inputRef}
        disabled={disabled}
        autoComplete={autoComplete}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldPasswordInput;

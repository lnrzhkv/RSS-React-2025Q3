import type { ChangeEventHandler } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { InputHTMLAttributes } from 'react';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const InputText = ({
  placeholder = 'Enter text',
  className = '',
  testId,
  id = '',
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
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-text ${className}`}
      {...rest}
    />
  );
};

const FormFieldText = ({
  id,
  value,
  onChange,
  placeholder,
  error,
  testId,
  disabled,
  ...rest
}: {
  value?: string;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <InputText
        testId={`${id}-input-text`}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldText;

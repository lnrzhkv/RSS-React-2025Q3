import { type RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { InputHTMLAttributes } from 'react';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const InputText = ({
  placeholder = 'Enter text',
  className = '',
  inputRef,
  testId,
  id = '',
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
      type="text"
      placeholder={placeholder}
      className={`input-text ${className}`}
      {...rest}
    />
  );
};

const FormFieldTextInput = ({
  id,
  inputRef,
  placeholder,
  error,
  testId,
  disabled,
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <InputText
        testId={`${id}-input-text`}
        placeholder={placeholder}
        id={id}
        inputRef={inputRef}
        disabled={disabled}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldTextInput;

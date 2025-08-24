import type { InputHTMLAttributes, RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const InputNumber = ({
  placeholder = 'Enter number',
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
      {...rest}
      id={id}
      ref={inputRef}
      type="number"
      placeholder={placeholder}
      className={`input-number ${className}`}
      data-testid={testId}
    />
  );
};

const FormFieldNumberInput = ({
  id,
  inputRef,
  placeholder,
  error,
  disabled,
  testId,
  min,
  max,
  step,
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <InputNumber
        placeholder={placeholder}
        id={id}
        inputRef={inputRef}
        testId={`${id}-number`}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldNumberInput;

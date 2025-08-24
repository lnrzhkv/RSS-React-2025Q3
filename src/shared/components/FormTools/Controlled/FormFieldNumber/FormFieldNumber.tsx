import type { ChangeEventHandler } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const FormFieldNumber = ({
  id,
  value,
  onChange,
  placeholder = 'Enter number',
  error,
  disabled,
  testId,
  min,
  max,
  step,
  ...rest
}: {
  value?: number;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
  min?: number | string | undefined;
  max?: number | string | undefined;
  step?: number;
} & BaseFormElementProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <Input
        type="number"
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={handleChange}
        testId={`${id}-number`}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="input-number"
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldNumber;

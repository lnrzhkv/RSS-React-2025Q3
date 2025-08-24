import type { ChangeEventHandler } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Select from '../../../Select/Select';

const FormFieldSelect = ({
  id,
  value,
  onChange,
  error,
  options = [],
  testId,
  disabled,
  ...rest
}: {
  value?: string;
  onChange?: ((e: React.ChangeEvent<HTMLSelectElement>) => void) &
    ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  options: string[];
  testId?: string;
  disabled?: boolean;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <Select
        testId={`${id}-select`}
        value={value}
        onChange={onChange}
        options={options}
        id={id}
        disabled={disabled}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldSelect;

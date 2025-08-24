import { type RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Select from '../../../Select/Select';

const FormFieldSelect = ({
  id,
  selectRef,
  error,
  options = [],
  testId,
  disabled,
  ...rest
}: {
  selectRef: RefObject<HTMLSelectElement | null>;
  error?: string;
  options: string[];
  disabled?: boolean;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <Select
        testId={`${id}-select`}
        options={options}
        id={id}
        selectRef={selectRef}
        disabled={disabled}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldSelect;

import {
  type ChangeEventHandler,
  type InputHTMLAttributes,
  useMemo,
} from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const AutoCompleteSelect = ({
  className = '',
  id = '',
  options = [],
  testId = '',
  value,
  onChange,
  onBlur,
  name,
  ...rest
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  options: string[];
} & InputHTMLAttributes<HTMLInputElement> &
  BaseFormElementProps) => {
  const listId = `${id}-datalist`;

  return (
    <>
      <Input
        {...rest}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        data-testid={testId}
        id={id}
        className={`autocomplete-select ${className}`}
        list={listId}
        autoComplete="off"
      />
      <datalist data-testid={`${testId}-datalist`} id={listId}>
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option
              data-testid={`${testId}-option-${index}`}
              key={option}
              value={option}
            />
          ))}
      </datalist>
    </>
  );
};

const FormFieldAutoCompleteSelect = ({
  id,
  value = '',
  onChange,
  onBlur,
  name,
  error,
  options = [],
  testId,
  disabled,
  filterFn = (option: string, inputValue: string) =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  ...rest
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  error?: string;
  options: string[];
  testId?: string;
  disabled?: boolean;
  filterFn?: (option: string, inputValue: string) => boolean;
} & BaseFormElementProps) => {
  const filteredOptions = useMemo(() => {
    if (!value) return options;
    return options.filter((option) => filterFn(option, value));
  }, [value, options, filterFn]);

  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <AutoCompleteSelect
        testId={`${id}-autocomplete-select`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        options={filteredOptions}
        id={id}
        disabled={disabled}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldAutoCompleteSelect;

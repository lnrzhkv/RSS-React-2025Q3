import type { InputHTMLAttributes, RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import Input from '../../../Input/Input';

const AutoCompleteSelect = ({
  className = '',
  inputRef,
  id = '',
  options = [],
  testId = '',
  ...rest
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  options: string[];
} & InputHTMLAttributes<HTMLInputElement> &
  BaseFormElementProps) => {
  const listId = `${id}-datalist`;

  return (
    <>
      <Input
        {...rest}
        data-testid={testId}
        id={id}
        ref={inputRef}
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
  inputRef,
  placeholder,
  error,
  options,
  name,
  testId = '',
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  error?: string;
  options: string[];
  name?: string;
} & BaseFormElementProps) => {
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <AutoCompleteSelect
        name={name}
        testId={`${id}-autocomplete-select`}
        options={options}
        placeholder={placeholder}
        id={id}
        inputRef={inputRef}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldAutoCompleteSelect;

import { type RefObject } from 'react';
import FormElement from '../../FormElement/FormElement';
import type { BaseFormElementProps } from '../../types';
import ImageLoader from '../../../ImageLoader/ImageLoader';

const FormFieldImageloader = ({
  id,
  inputRef,
  error,
  onClear,
  testId = '',
  ...rest
}: {
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder?: string;
  error?: string;
  onClear?: () => void;
} & BaseFormElementProps) => {
  console.log(error, 'error');
  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <ImageLoader
        id={id}
        inputRef={inputRef}
        testId={`${id}-imageloader`}
        onClear={onClear}
        {...rest}
      />
    </FormElement>
  );
};

export default FormFieldImageloader;

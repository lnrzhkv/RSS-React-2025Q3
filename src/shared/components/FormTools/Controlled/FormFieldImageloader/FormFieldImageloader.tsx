import { useState } from 'react';
import FormElement from '../../FormElement/FormElement';
import styles from '../../../ImageLoader/ImageLoader.module.css';
import type { BaseFormElementProps } from '../../types';

type ControlledFormFieldImageloaderProps = {
  id: string;
  placeholder?: string;
  testId?: string;
  error?: string;
  value?: File | string;
  onChange?: (value: File | string) => void;
  trigger?: () => Promise<boolean>;
} & BaseFormElementProps;

const ControlledFormFieldImageloader = ({
  id,
  placeholder,
  testId = '',
  error,
  value,
  onChange,
  trigger,
}: ControlledFormFieldImageloaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(
    typeof value === 'string' ? value : ''
  );
  const hasImageType = value instanceof File && value.type.startsWith('image/');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : '');
    onChange?.(selectedFile || '');
    trigger?.();
  };

  const handleClearFile = () => {
    setPreviewUrl('');
    onChange?.('');
  };

  return (
    <FormElement id={id} error={error} testId={testId || `${id}-form-element`}>
      <div className={styles['file-input-container']}>
        <input
          id={id}
          type="file"
          className={styles['file-input']}
          onChange={handleFileChange}
          data-testid={`${testId}-imageloader-input`}
        />
        <div
          className={`${styles['file-input-label']} ${previewUrl ? 'has-file' : ''}`}
        >
          {previewUrl ? (
            <>
              <span>
                {typeof value === 'object' ? value.name : 'Uploaded file'}
              </span>
              <button
                type="button"
                onClick={handleClearFile}
                className={styles['clear-button']}
              >
                Clear
              </button>
            </>
          ) : (
            placeholder || 'Upload a file'
          )}
        </div>
        {previewUrl && hasImageType && (
          <img
            src={previewUrl}
            alt="Preview"
            className={styles['file-preview']}
          />
        )}
      </div>
    </FormElement>
  );
};

export default ControlledFormFieldImageloader;

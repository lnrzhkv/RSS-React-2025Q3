import { useState, type InputHTMLAttributes, type RefObject } from 'react';
import styles from './ImageLoader.module.css';

const ImageLoader = ({
  className = '',
  inputRef,
  onClear,
  id = '',
  testId = '',
  ...rest
}: {
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onClear?: () => void;
  testId?: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFileName = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPreviewUrl = reader.result as string;
          setFileName(newFileName);
          setPreviewUrl(newPreviewUrl);
        };
        reader.readAsDataURL(file);
      } else {
        setFileName(newFileName);
        setPreviewUrl('');
      }
    } else {
      setFileName('');
      setPreviewUrl('');
    }
  };

  const clearFile = () => {
    setFileName('');
    setPreviewUrl('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div data-testid={testId} className={styles['file-input-container']}>
      <input
        data-testid={`${testId}-input`}
        id={id}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg, image/png"
        className={`${styles['file-input']} ${className}`}
        {...rest}
      />

      <div
        data-testid={`${testId}-label`}
        className={`${styles['file-input-label']} ${fileName ? 'has-file' : ''}`}
      >
        {fileName ? (
          <>
            <span data-testid={`${testId}-file-name`}>{fileName}</span>
            <button
              type="button"
              onClick={clearFile}
              data-testid={`${testId}-clear-button`}
              className={styles['clear-button']}
            >
              Clear
            </button>
          </>
        ) : (
          <>
            <svg
              data-testid={`${testId}-svg`}
              className={styles['upload-icon']}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 5v14M5 12h14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Choose File
          </>
        )}
      </div>

      {previewUrl && (
        <img
          data-testid={`${testId}-preview`}
          src={previewUrl}
          alt="Preview"
          className={styles['file-preview']}
        />
      )}
    </div>
  );
};

export default ImageLoader;

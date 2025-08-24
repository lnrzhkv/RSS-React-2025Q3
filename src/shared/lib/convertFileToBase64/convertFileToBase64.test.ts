import { convertFileToBase64 } from './convertFileToBase64';

describe('convertFileToBase64', () => {
  let file: File;

  beforeEach(() => {
    file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  });

  it('Have correct return type', async () => {
    const result = await convertFileToBase64(file);

    expect(typeof result).toBe('string');
    expect(result).toMatch(/^data:text\/plain;base64,/);
  });

  it('Have correct error', async () => {
    type ErrorCallback = (error: Error) => void;
    let onErrorCallback: ErrorCallback | null = null;

    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: null,
      set onerror(callback: ErrorCallback | null) {
        onErrorCallback = callback;
      },
      get onerror() {
        return onErrorCallback;
      },
      onload: null,
    };

    jest
      .spyOn(window, 'FileReader')
      .mockImplementation(() => mockFileReader as unknown as FileReader);

    const promise = convertFileToBase64(file);

    const testError = new Error('Error reading file');

    setTimeout(() => {
      if (onErrorCallback) {
        onErrorCallback(testError);
      }
    });

    await expect(promise).rejects.toBe(testError);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

import { useRef, useState } from 'react';
import { formSchema, type FormData } from '../../shared/validations/validation';
import { useFormStore } from '../../shared/store/useFormStore';
import { Uncontrolled } from '../../shared/components/FormTools';
import { convertFileToBase64 } from '../../shared/lib/convertFileToBase64/convertFileToBase64';
import { Button } from '../../shared/components/Button/Button';
import styles from './UncontrolledForm.module.css';

const UncontrolledForm = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      acceptedTerms: '',
      age: '',
      country: '',
      picture: '',
    }
  );

  const setModalDataByKey = useFormStore((s) => s.setModalDataByKey);
  const countriesVariants = useFormStore((s) => s.countriesVariants);
  const closeModal = useFormStore((s) => s.closeModal);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputConfirmPasswordRef = useRef<HTMLInputElement>(null);
  const selectGenderRef = useRef<HTMLSelectElement>(null);
  const inputAcceptedTermsRef = useRef<HTMLInputElement>(null);
  const inputAgeRef = useRef<HTMLInputElement>(null);
  const inputCountryRef = useRef<HTMLInputElement>(null);
  const inputPictureRef = useRef<HTMLInputElement>(null);

  const getRefsValues = (): FormData => {
    const name = inputNameRef.current?.value || '';
    const email = inputEmailRef.current?.value || '';
    const password = inputPasswordRef.current?.value || '';
    const confirmPassword = inputConfirmPasswordRef.current?.value || '';
    const gender = selectGenderRef.current?.value || '';
    const acceptedTerms = inputAcceptedTermsRef.current?.checked || false;
    const age = inputAgeRef.current?.value ? +inputAgeRef.current?.value : 0;
    const country = inputCountryRef.current?.value || '';
    const picture = inputPictureRef.current?.files?.[0] || '';
    return {
      name,
      email,
      password,
      confirmPassword,
      gender,
      acceptedTerms,
      age,
      country,
      picture,
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      const values = getRefsValues();

      let pictureBase64: string = '';
      if (values.picture instanceof File) {
        pictureBase64 = await convertFileToBase64(values.picture);
      }

      const formData = {
        ...values,
        picture: pictureBase64,
      };

      setModalDataByKey('uncontrolled', formData);
      closeModal();
    }
  };

  const handleClearFile = () => {
    if (inputPictureRef.current) {
      inputPictureRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const values = getRefsValues();

    const isFormSchemaKey = (key: string): key is keyof FormData => {
      return key in formSchema.shape;
    };

    const validationResults = formSchema.safeParse(values);

    if (!validationResults.success) {
      const issues = validationResults.error.issues;
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};

      for (const issue of issues) {
        const fieldName = issue.path[0];
        if (typeof fieldName === 'string' && isFormSchemaKey(fieldName)) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  return (
    <form data-testid="uncontrolled-form" onSubmit={(e) => handleSubmit(e)}>
      <Uncontrolled.TextInput
        id="name"
        placeholder="Enter name"
        inputRef={inputNameRef}
        error={errors.name}
        testId="name"
      />

      <Uncontrolled.TextInput
        id="email"
        placeholder="Enter email"
        inputRef={inputEmailRef}
        error={errors.email}
        testId="email"
      />

      <Uncontrolled.PasswordInput
        id="password"
        placeholder="Enter password"
        inputRef={inputPasswordRef}
        error={errors.password}
        testId="password"
      />

      <Uncontrolled.PasswordInput
        id="confirmPassword"
        placeholder="Confirm password"
        inputRef={inputConfirmPasswordRef}
        error={errors.confirmPassword}
        testId="confirm-password"
      />
      <div className={styles.formGroup}>
        <Uncontrolled.Select
          id="gender"
          options={['male', 'female']}
          selectRef={selectGenderRef}
          error={errors.gender}
          testId="gender"
        />

        <Uncontrolled.AutoCompleteSelect
          options={countriesVariants}
          id="country"
          placeholder="Enter country"
          inputRef={inputCountryRef}
          error={errors.country}
          testId="country"
        />
      </div>

      <Uncontrolled.NumberInput
        id="age"
        placeholder="Enter age"
        inputRef={inputAgeRef}
        error={errors.age}
        testId="age"
      />

      <Uncontrolled.Imageloader
        id="picture"
        inputRef={inputPictureRef}
        onClear={handleClearFile}
        error={errors.picture}
        testId="picture"
      />

      <Uncontrolled.Checkbox
        id="acceptedTerms"
        label="Accept terms"
        inputRef={inputAcceptedTermsRef}
        error={errors.acceptedTerms}
        testId="accepted-terms"
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default UncontrolledForm;

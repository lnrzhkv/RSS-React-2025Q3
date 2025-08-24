import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formSchema, type FormData } from '../../shared/validations/validation';
import { Controlled } from '../../shared/components/FormTools';
import { Button } from '../../shared/components/Button/Button';
import styles from './ControlledForm.module.css';
import { useFormStore } from '../../shared/store/useFormStore';
import { convertFileToBase64 } from '../../shared/lib/convertFileToBase64/convertFileToBase64';

const ControlledForm = () => {
  const setModalDataByKey = useFormStore((s) => s.setModalDataByKey);
  const countriesVariants = useFormStore((s) => s.countriesVariants);
  const closeModal = useFormStore((s) => s.closeModal);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      acceptedTerms: false,
      age: undefined,
      country: '',
      picture: '',
    },
  });

  console.log('Watched values:', watch());

  const isErrorExist = Object.keys(errors).length > 0;

  const onSubmit = async (data: FormData) => {
    let pictureBase64 = '';
    if (data.picture instanceof File) {
      pictureBase64 = await convertFileToBase64(data.picture);
    }

    const formData = {
      ...data,
      picture: pictureBase64,
    };

    setModalDataByKey('controlled', formData);
    closeModal();
  };

  return (
    <form data-testid="controlled-form" onSubmit={handleSubmit(onSubmit)}>
      <Controlled.TextInput
        id="name"
        testId="name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Controlled.TextInput
        id="email"
        testId="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Controlled.PasswordInput
        id="password"
        testId="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Controlled.PasswordInput
        id="confirmPassword"
        testId="confirmPassword"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <div className={styles.formGroup}>
        <Controlled.Select
          id="gender"
          testId="gender"
          options={['male', 'female']}
          {...register('gender', {
            onChange: (e) => {
              setValue('gender', e.target.value);
            },
          })}
          error={errors.gender?.message}
        />

        <Controlled.AutoCompleteSelect
          id="country"
          testId="country"
          options={countriesVariants}
          value={watch('country')}
          onChange={(e) => {
            setValue('country', e.target.value);
          }}
          error={errors.country?.message}
        />
      </div>

      <Controlled.NumberInput
        id="age"
        testId="age"
        placeholder="Enter age"
        {...register('age', {
          valueAsNumber: true,
          onChange: (e) => {
            const value =
              e.target.value === '' ? undefined : parseInt(e.target.value, 10);
            setValue('age', value);
          },
        })}
        error={errors.age?.message}
      />

      <Controlled.Imageloader
        id="picture"
        testId="picture"
        value={watch('picture')}
        error={errors.picture?.message}
        trigger={trigger}
        onChange={(value) => setValue('picture', value)}
      />

      <Controlled.Checkbox
        id="acceptedTerms"
        testId="accepted-terms-checkbox-wrapper"
        label="Accept terms"
        {...register('acceptedTerms')}
        error={errors.acceptedTerms?.message}
      />

      <Button testId="submit-button" disabled={isErrorExist} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default ControlledForm;

import z from 'zod';

const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((val) => val[0] === val[0]?.toUpperCase(), {
        message: 'First letter must be uppercase',
      }),
    age: z
      .preprocess((val) => {
        if (val === '' || val === undefined || val === null) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .refine((val) => val !== null && val > 0, {
        message: 'Age is required and must be greater than 0',
      }),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordStrengthRegex,
        'Password must contain at least 1 number, 1 uppercase, 1 lowercase, and 1 special character'
      ),
    confirmPassword: z.string(),
    gender: z.string().min(1, 'Gender is required'),
    acceptedTerms: z.boolean().refine((val) => val, {
      message: 'You must accept the terms and conditions',
    }),
    picture: z
      .instanceof(File)
      .refine((file) => file.size <= 5000000, 'Max file size is 5MB')
      .refine(
        (file) => ['image/jpeg', 'image/png'].includes(file.type),
        'Only JPEG and PNG images are allowed'
      )
      .or(z.string().nonempty('File is required')),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type FormData = z.infer<typeof formSchema>;

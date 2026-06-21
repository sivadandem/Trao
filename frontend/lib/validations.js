import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const tripSchema = z.object({
  destination: z
    .string()
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination is too long'),
  durationDays: z
    .number({ invalid_type_error: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(30, 'Duration cannot exceed 30 days'),
  budgetTier: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a budget tier' }),
  }),
  interests: z
    .array(z.enum(['food', 'culture', 'adventure', 'shopping', 'nature', 'nightlife', 'family', 'history']))
    .min(1, 'Select at least one interest'),
});

export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  estimatedCost: z.number().min(0, 'Cost cannot be negative').optional(),
  time: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

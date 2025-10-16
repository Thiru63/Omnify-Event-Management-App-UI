import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255, 'Event name is too long'),
  location: z.string().min(1, 'Location is required').max(255, 'Location is too long'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  max_capacity: z.number().min(1, 'Capacity must be at least 1').max(10000, 'Capacity cannot exceed 10000'),
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const registerAttendeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Please enter a valid email').max(255, 'Email is too long'),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type RegisterAttendeeFormData = z.infer<typeof registerAttendeeSchema>;
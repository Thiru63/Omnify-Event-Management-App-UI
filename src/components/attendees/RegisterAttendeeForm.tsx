'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApi } from '@/hooks/use-api';
import { registerAttendeeSchema, type RegisterAttendeeFormData } from '@/lib/validations';

interface RegisterAttendeeFormProps {
  eventId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RegisterAttendeeForm({ eventId, onSuccess, onCancel }: RegisterAttendeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { registerAttendee } = useApi();

  const form = useForm<RegisterAttendeeFormData>({
    resolver: zodResolver(registerAttendeeSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: RegisterAttendeeFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      console.log('Registering attendee:', { eventId, ...data });
      
      const response = await registerAttendee(eventId, data);
      console.log('✅ Attendee registered successfully!', response);
      
      setSubmitStatus('success');
      form.reset();
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to register attendee:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to register attendee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-600">
            The attendee has been successfully registered for the event.
          </p>
        </div>
        <Button onClick={onSuccess} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter attendee's full name" 
                  {...field} 
                  className="h-11 text-base"
                />
              </FormControl>
              <FormDescription>
                The full name of the person attending the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter email address" 
                  type="email"
                  {...field} 
                  className="h-11 text-base"
                />
              </FormControl>
              <FormDescription>
                A unique email address for this event registration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-24"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-24 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Note:</strong> Each email can only register once per event. 
            The same email can register for different events.
          </p>
        </div>
      </form>
    </Form>
  );
}
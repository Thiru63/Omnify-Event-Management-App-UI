'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/hooks/use-api';
import { createEventSchema, type CreateEventFormData } from '@/lib/validations';
import { getTimezoneOptions } from '@/lib/timezones';

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Extend the form data type to include timezone
type ExtendedCreateEventFormData = CreateEventFormData & {
  timezone: string;
};

export function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEvent } = useApi();

  const form = useForm<ExtendedCreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      location: '',
      start_time: '',
      end_time: '',
      max_capacity: 100,
      timezone: 'Asia/Kolkata', // Default timezone
    },
  });

  const onSubmit = async (data: ExtendedCreateEventFormData) => {
    setIsSubmitting(true);
    try {
      // Format dates to the required format (YYYY-MM-DD HH:mm:ss)
      const formattedData = {
        name: data.name,
        location: data.location,
        start_time: format(new Date(data.start_time), 'yyyy-MM-dd HH:mm:ss'),
        end_time: format(new Date(data.end_time), 'yyyy-MM-dd HH:mm:ss'),
        max_capacity: data.max_capacity,
        timezone: data.timezone, // Include timezone in the request
      };

      console.log('Creating event with data:', formattedData);
      
      // Call the actual API
      const response = await createEvent(formattedData);
      console.log('✅ Event created successfully!', response);
      
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to create event:', error);
      alert(error.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Tech Conference 2024" {...field} />
              </FormControl>
              <FormDescription>
                Enter a descriptive name for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Bangalore Convention Center" {...field} />
              </FormControl>
              <FormDescription>
                Where will the event take place?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timezone Field */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getTimezoneOptions().map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the timezone for your event timing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP HH:mm')
                        ) : (
                          <span>Pick start date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const currentTime = field.value ? new Date(field.value) : new Date();
                            const newDateTime = new Date(date);
                            newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
                            field.onChange(newDateTime.toISOString());
                          }
                        }}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                          onChange={(e) => {
                            if (field.value && e.target.value) {
                              const date = new Date(field.value);
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              date.setHours(hours, minutes);
                              field.onChange(date.toISOString());
                            }
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When does the event start?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP HH:mm')
                        ) : (
                          <span>Pick end date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const currentTime = field.value ? new Date(field.value) : new Date();
                            const newDateTime = new Date(date);
                            newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
                            field.onChange(date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <Input
                          type="time"
                          value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                          onChange={(e) => {
                            if (field.value && e.target.value) {
                              const date = new Date(field.value);
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              date.setHours(hours, minutes);
                              field.onChange(date.toISOString());
                            }
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When does the event end?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="max_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="100"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Maximum number of attendees allowed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/use-api';
import { Event } from '@/types';

interface EventDetailProps {
  eventId: number;
  timezone?: string;
  refreshTrigger?: number; // ADD THIS PROP
  onEventDataLoaded?: (event: Event) => void; // Add this
}

// Custom date formatting function (same as in EventList)
const formatEventDateCustom = (dateString: string) => {
  if (!dateString) {
    return {
      dateTime: 'Invalid date',
      date: 'Invalid date',
      time: '',
      day: '',
      timezone: 'Unknown',
    };
  }

  try {
    // Manual parsing of ISO string with timezone
    const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})$/;
    const match = dateString.match(regex);
    
    if (!match) {
      throw new Error('Invalid date format');
    }

    const [, year, month, day, hours, minutes, seconds, timezoneOffset] = match;
    
    // Create date object in UTC for day calculation
    const date = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    ));

    // Month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Day names
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const monthIndex = parseInt(month) - 1;
    const dayIndex = date.getUTCDay();

    // Format time (24-hour format)
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    
    // Format date
    const fullFormattedDate = `${monthNames[monthIndex]} ${parseInt(day)}, ${year}`;

    return {
      dateTime: `${dayNames[dayIndex]}, ${fullFormattedDate} • ${formattedTime}`,
      date: fullFormattedDate,
      time: formattedTime,
      day: dayNames[dayIndex],
      timezone: `UTC${timezoneOffset}`,
    };
  } catch (error) {
    console.error('❌ Custom date formatting error:', error, 'for date:', dateString);
    
    // Fallback
    try {
      const date = new Date(dateString);
      return {
        dateTime: date.toLocaleString('en-US'),
        date: date.toLocaleDateString('en-US'),
        time: date.toLocaleTimeString('en-US'),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        timezone: 'Fallback',
      };
    } catch (fallbackError) {
      return {
        dateTime: 'Invalid date',
        date: 'Invalid date',
        time: '',
        day: '',
        timezone: 'Error',
      };
    }
  }
};

export function EventDetail({ eventId, timezone = 'Asia/Kolkata', refreshTrigger = 0, onEventDataLoaded }: EventDetailProps) { // ADD refreshTrigger HERE
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { getEvents } = useApi();

  useEffect(() => {
    loadEvent();
  }, [eventId, timezone, refreshTrigger]); // ADD refreshTrigger TO DEPENDENCY ARRAY

  const loadEvent = async () => {
    try {
      setLoading(true);
      console.log('🔍 EventDetail loading event with timezone:', timezone, 'refreshTrigger:', refreshTrigger);
      
      const response = await getEvents({ 
        per_page: 50,
        timezone: timezone,
        page: 1
      });
      
      if (response.success) {
        const foundEvent = response.data.data.find(e => e.id === eventId);
        console.log('🔍 EventDetail loaded event:', {
          eventId,
          timezone,
          refreshTrigger,
          found: !!foundEvent,
          currentAttendees: foundEvent?.current_attendees,
          availableCapacity: foundEvent?.available_capacity
        });
        
        if (foundEvent) {
          setEvent(foundEvent);
          // Call the callback to notify parent about event data
          if (onEventDataLoaded) {
            onEventDataLoaded(foundEvent);
          }
        } else {
          setEvent(null);
        }
      } else {
        console.error('❌ Failed to load events in EventDetail');
         setEvent(null);
      }
    } catch (error: any) {
      console.error('❌ Failed to load event:', error);
       setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const getCapacityPercentage = (event: Event) => {
    return (event.current_attendees / event.max_capacity) * 100;
  };

  const getCapacityVariant = (event: Event) => {
    const percentage = getCapacityPercentage(event);
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'default';
    return 'secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Event Not Found
            </h3>
            <p className="text-gray-500">
              The event you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const startTime = formatEventDateCustom(event.start_time);
  const endTime = formatEventDateCustom(event.end_time);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div>
            <CardTitle className="text-2xl mb-2">{event.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {event.location}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getCapacityVariant(event)} className="text-sm px-3 py-1">
              {event.current_attendees}/{event.max_capacity} attendees
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              Timezone: {timezone}
            </Badge>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Event Capacity</span>
            <span className="font-medium">
              {getCapacityPercentage(event).toFixed(1)}% full
            </span>
          </div>
          <Progress value={getCapacityPercentage(event)} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Event Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Event Timing
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-muted-foreground mb-1">Starts</div>
                <div className="text-foreground font-semibold">{startTime.dateTime}</div>
                <div className="text-xs text-gray-500 mt-1">{startTime.timezone}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-muted-foreground mb-1">Ends</div>
                <div className="text-foreground font-semibold">{endTime.dateTime}</div>
                <div className="text-xs text-gray-500 mt-1">{endTime.timezone}</div>
              </div>
            </div>
          </div>

          {/* Event Stats */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Event Statistics
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Max Capacity</span>
                <span className="font-medium">{event.max_capacity}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Current Attendees</span>
                <span className="font-medium">{event.current_attendees}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Available Seats</span>
                <span className="font-medium text-green-600">{event.available_capacity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created: {new Date(event.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Badge>
          {event.available_capacity > 0 ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
              <UserCheck className="h-3 w-3 mr-1" />
              Accepting Registrations
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Fully Booked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
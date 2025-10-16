'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/use-api';
import { Event } from '@/types';
import { format, parseISO } from 'date-fns';

interface EventDetailProps {
  eventId: number;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { getEvents } = useApi();

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      // For now, we'll filter from the events list since we don't have a single event endpoint
      const response = await getEvents({ per_page: 50 });
      if (response.success) {
        const foundEvent = response.data.data.find(e => e.id === eventId);
        setEvent(foundEvent || null);
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, MMMM dd, yyyy • HH:mm');
    } catch (error) {
      return 'Invalid date';
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
          <Badge variant={getCapacityVariant(event)} className="text-sm px-3 py-1">
            {event.current_attendees}/{event.max_capacity} attendees
          </Badge>
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
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Starts</div>
                <div className="text-foreground">{formatDate(event.start_time)}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Ends</div>
                <div className="text-foreground">{formatDate(event.end_time)}</div>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Capacity</span>
                <span className="font-medium">{event.max_capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Attendees</span>
                <span className="font-medium">{event.current_attendees}</span>
              </div>
              <div className="flex justify-between">
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
            Created: {format(parseISO(event.created_at), 'MMM dd, yyyy')}
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
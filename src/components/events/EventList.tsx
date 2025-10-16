'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EventFilters } from './EventFilters';
import { useApi } from '@/hooks/use-api';
import { Event, EventFilters as EventFiltersType } from '@/types';
import { format, parseISO } from 'date-fns';
import { CreateEventDialog } from './CreateEventDialog';

const defaultFilters: EventFiltersType = {
  timezone: 'Asia/Kolkata',
  page: 1,
  per_page: 10,
  sort_by: 'start_time',
  sort_order: 'asc',
  search_in: 'name',
  seat_available_events: false,
};

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFiltersType>(defaultFilters);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const { getEvents, getLocations } = useApi();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEventCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    loadEvents();
    loadLocations();
  }, [filters,refreshTrigger]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(filters);
      if (response.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      if (response.success) {
        setAvailableLocations(response.data);
      }
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
  };

  const formatEventDate = (dateString: string, timezone: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCapacityColor = (event: Event) => {
    const percentage = (event.current_attendees / event.max_capacity) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'default';
    return 'secondary';
  };

  if (loading && events.length === 0) {
    return (
      <div className="space-y-6">
        <EventFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          availableLocations={availableLocations}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <EventFilters 
        filters={filters} 
        onFiltersChange={handleFiltersChange}
        availableLocations={availableLocations}
      />

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Calendar className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-500 mb-4">
                  {filters.search_for || filters.filter_by_location?.length 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'Create your first event to get started.'}
                </p>
                {!filters.search_for && !filters.filter_by_location?.length && (
                   <CreateEventDialog onSuccess={handleEventCreated} />
                  // <Button asChild>
                  //   <Link href="/dashboard">
                  //     <Plus className="mr-2 h-4 w-4" />
                  //     Create Event
                  //   </Link>
                  // </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getCapacityColor(event)}>
                    {event.current_attendees}/{event.max_capacity}
                  </Badge>
                  {event.available_capacity > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {event.available_capacity} seats left
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  <Link 
                    href={`/dashboard/events/${event.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {event.name}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatEventDate(event.start_time, filters.timezone)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Ends: {formatEventDate(event.end_time, filters.timezone)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{event.current_attendees} registered</span>
                </div>
                
                <div className="pt-3 border-t">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/events/${event.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
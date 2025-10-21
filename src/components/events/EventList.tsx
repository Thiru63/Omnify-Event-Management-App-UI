'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EventFilters } from './EventFilters';
import { useApi } from '@/hooks/use-api';
import { Event, EventFilters as EventFiltersType, PaginationMeta } from '@/types';
import { CreateEventDialog } from './CreateEventDialog';

const defaultFilters: EventFiltersType = {
  timezone: 'Asia/Kolkata',
  page: 1,
  per_page: 10,
  sort_by: 'start_time',
  sort_order: 'asc',
  search_in: 'all',
  seat_available_events: false,
};

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFiltersType>(defaultFilters);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0
  });
  
  const { getEvents, getLocations } = useApi();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get timezone from localStorage on component mount
  useEffect(() => {
    const savedTimezone = localStorage.getItem('event-timezone');
    if (savedTimezone) {
      setFilters(prev => ({ ...prev, timezone: savedTimezone }));
    }
  }, []);

  const handleEventCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    loadEvents();
    loadLocations();
  }, [filters, refreshTrigger]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(filters);
      if (response.success) {
        console.log('✅ Events loaded with timezone:', filters.timezone);
        setEvents(response.data.data);
        setPagination(response.data.pagination);
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
    console.log('🔄 Filters changed to:', newFilters);
    // Save timezone to localStorage whenever it changes
    if (newFilters.timezone !== filters.timezone) {
      localStorage.setItem('event-timezone', newFilters.timezone);
    }
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatEventDate = (dateString: string) => {
    if (!dateString) {
      return {
        date: 'Invalid date',
        time: '',
        full: 'Invalid date',
        day: '',
        dayFull: '',
        dateTime: 'Invalid date',
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
      
      const shortMonthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      // Day names
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const monthIndex = parseInt(month) - 1;
      const dayIndex = date.getUTCDay();

      // Format time (24-hour format)
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      
      // Format date
      const formattedDate = `${shortMonthNames[monthIndex]} ${parseInt(day)}, ${year}`;
      const fullFormattedDate = `${monthNames[monthIndex]} ${parseInt(day)}, ${year}`;

      return {
        date: formattedDate,
        time: formattedTime,
        full: `${formattedDate} ${formattedTime}`,
        day: shortDayNames[dayIndex],
        dayFull: dayNames[dayIndex],
        dateTime: `${dayNames[dayIndex]}, ${fullFormattedDate} • ${formattedTime}`,
        timezone: `UTC${timezoneOffset}`,
      };
    } catch (error) {
      console.error('❌ Date formatting error:', error, 'for date:', dateString);
      return {
        date: 'Invalid date',
        time: '',
        full: 'Invalid date',
        day: '',
        dayFull: '',
        dateTime: 'Invalid date',
        timezone: 'Unknown',
      };
    }
  };

  const getCapacityColor = (event: Event) => {
    const percentage = (event.current_attendees / event.max_capacity) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'default';
    return 'secondary';
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b);
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

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <EventFilters 
        filters={filters} 
        onFiltersChange={handleFiltersChange}
        availableLocations={availableLocations}
      />

      {/* Timezone Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Displaying times in: {filters.timezone.replace(/_/g, ' ')}
            </span>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Page {pagination.current_page} of {pagination.last_page}
          </Badge>
        </div>
      </div>

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
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const startTime = formatEventDate(event.start_time);
              const endTime = formatEventDate(event.end_time);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={getCapacityColor(event)}>
                        {event.current_attendees}/{event.max_capacity}
                      </Badge>
                      {event.available_capacity > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {event.available_capacity} seats left
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link 
                        href={`/dashboard/events/${event.id}?timezone=${encodeURIComponent(filters.timezone)}`}
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
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 mt-0.5 text-gray-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">Starts</div>
                          <div className="text-foreground font-semibold">
                            {startTime.dayFull}, {startTime.date} at {startTime.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="h-4 w-4 mt-0.5 text-gray-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">Ends</div>
                          <div className="text-foreground font-semibold">
                            {endTime.dayFull}, {endTime.date} at {endTime.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.current_attendees} registered</span>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/events/${event.id}?timezone=${encodeURIComponent(filters.timezone)}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.from}-{pagination.to} of {pagination.total} events
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                  // Add ellipsis for gaps in page numbers
                  const showEllipsis = index > 0 && page - pageNumbers[index - 1] > 1;
                  
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={pagination.current_page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Items Per Page Info */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {pagination.per_page} per page
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
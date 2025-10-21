'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';
import { AttendeeList } from '@/components/attendees/AttendeeList';
import { RegisterAttendeeDialog } from '@/components/attendees/RegisterAttendeeDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, UserX } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [isEventFull, setIsEventFull] = useState(false);

  // Get timezone from localStorage on component mount
  useEffect(() => {
    const savedTimezone = localStorage.getItem('event-timezone');
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
  }, []);

  const handleRegistrationSuccess = () => {
    console.log('🔄 Registration successful, refreshing event details and attendees...');
    setRefreshTrigger(prev => prev + 1);
  };

  // Function to check if event is full (will be called from EventDetail)
  const handleEventDataLoaded = (event: any) => {
    setIsEventFull(event.available_capacity === 0);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      {/* Timezone Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Displaying times in: {timezone.replace(/_/g, ' ')}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            <Link href="/dashboard">
              Change Timezone
            </Link>
          </Button>
        </div>
      </div>

      {/* Event Details - Pass refreshTrigger and onEventDataLoaded */}
      <EventDetail 
        eventId={eventId} 
        timezone={timezone}
        refreshTrigger={refreshTrigger}
        onEventDataLoaded={handleEventDataLoaded}
      />

      {/* Attendee Management Section */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Attendee Management</h2>
            </div>
            {isEventFull ? (
              <Button 
                disabled 
                className="bg-green-200 text-green-800 hover:bg-green-200 cursor-not-allowed"
              >
                <UserX className="mr-2 h-4 w-4" />
                Event Full
              </Button>
            ) : (
              <RegisterAttendeeDialog 
                eventId={eventId} 
                onSuccess={handleRegistrationSuccess}
              />
            )}
          </div>
        </div>
        
        <div className="p-6">
          <AttendeeList 
            eventId={eventId} 
            key={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { EventDetail } from '@/components/events/EventDetail';
import { AttendeeList } from '@/components/attendees/AttendeeList';
import { RegisterAttendeeDialog } from '@/components/attendees/RegisterAttendeeDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRegistrationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
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

      {/* Event Details */}
      <EventDetail eventId={eventId} />

      {/* Attendee Management Section */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Attendee Management</h2>
            </div>
            <RegisterAttendeeDialog 
              eventId={eventId} 
              onSuccess={handleRegistrationSuccess}
            />
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
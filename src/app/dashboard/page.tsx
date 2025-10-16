'use client';

import { useState } from 'react';
import { CreateEventDialog } from '@/components/events/CreateEventDialog';
import { EventList } from '@/components/events/EventList';

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEventCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">
            Manage your events and attendee registrations
          </p>
        </div>
        <CreateEventDialog onSuccess={handleEventCreated} />
      </div>

      {/* Event List */}
      <EventList key={refreshTrigger} />
    </div>
  );
}
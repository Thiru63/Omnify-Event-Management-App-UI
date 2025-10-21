'use client';

import { useState } from 'react';
import { UserPlus, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RegisterAttendeeForm } from './RegisterAttendeeForm';

interface RegisterAttendeeDialogProps {
  eventId: number;
  onSuccess?: () => void;
  disabled?: boolean; // Add disabled prop
}

export function RegisterAttendeeDialog({ 
  eventId, 
  onSuccess,
  disabled = false // Default to false
}: RegisterAttendeeDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Prevent dialog from opening when disabled
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          disabled={disabled}
          onClick={handleTriggerClick}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Register Attendee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Attendee
          </DialogTitle>
          <DialogDescription>
            Add a new attendee to this event. Each email can only register once per event.
          </DialogDescription>
        </DialogHeader>
        <RegisterAttendeeForm 
          eventId={eventId} 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
import { useState, useCallback } from 'react';
import { eventApi, attendeeApi } from '@/lib/api';
import { Event, Attendee, CreateEventFormData, RegisterAttendeeFormData } from '@/types';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(async (data: CreateEventFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventApi.create(data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEvents = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventApi.getAll(params);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch events';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerAttendee = useCallback(async (eventId: number, data: RegisterAttendeeFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendeeApi.register(eventId, data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Failed to register attendee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventAttendees = useCallback(async (eventId: number, params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendeeApi.getByEvent(eventId, params);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch attendees';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventApi.getLocations();
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch locations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    createEvent,
    getEvents,
    registerAttendee,
    getEventAttendees,
    getLocations,
  };
};
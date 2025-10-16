import axios from 'axios';
import { Event, Attendee, EventsResponse, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Event API methods
export const eventApi = {
  create: async (data: {
    name: string;
    location: string;
    start_time: string;
    end_time: string;
    max_capacity: number;
  }): Promise<ApiResponse<Event>> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search_for?: string;
    search_in?: string;
    sort_by?: string;
    sort_order?: string;
    filter_by_location?: string;
    seat_available_events?: boolean;
    timezone?: string;
  }): Promise<ApiResponse<EventsResponse>> => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getLocations: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/events/locations');
    return response.data;
  },
};

// Attendee API methods
export const attendeeApi = {
  register: async (eventId: number, data: { name: string; email: string }): Promise<ApiResponse<Attendee>> => {
    const response = await api.post(`/events/${eventId}/register`, data);
    return response.data;
  },

  getByEvent: async (eventId: number, params?: {
    page?: number;
    per_page?: number;
    search_for?: string;
  }): Promise<ApiResponse<{
    data: Attendee[];
    pagination: any;
    event: Event;
  }>> => {
    const response = await api.get(`/events/${eventId}/attendees`, { params });
    return response.data;
  },
};
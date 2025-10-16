export interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_attendees: number;
  available_capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  id: number;
  event_id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface EventsResponse {
  data: Event[];
  pagination: PaginationMeta;
  filters_applied: {
    sort_by: string;
    sort_order: string;
    search_for?: string;
    search_in?: string;
    filter_by_location?: string[];
    seat_available_events?: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateEventFormData {
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

export interface RegisterAttendeeFormData {
  name: string;
  email: string;
}

export interface EventFilters {
  timezone: string;
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
  search_for?: string;
  search_in: string;
  filter_by_location?: string[];
  seat_available_events: boolean;
}
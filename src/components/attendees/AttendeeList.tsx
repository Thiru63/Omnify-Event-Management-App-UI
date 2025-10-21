'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Mail, Calendar, User, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApi } from '@/hooks/use-api';
import { Attendee, PaginationMeta } from '@/types';
import { format, parseISO } from 'date-fns';

interface AttendeeListProps {
  eventId: number;
}

interface AttendeesResponse {
  data: Attendee[];
  pagination: PaginationMeta;
  event: any;
}

export function AttendeeList({ eventId }: AttendeeListProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0
  });
  
  const { getEventAttendees } = useApi();

  useEffect(() => {
    loadAttendees();
  }, [eventId, pagination.current_page, pagination.per_page, searchTerm]);

  const loadAttendees = async () => {
    try {
      setLoading(true);
      const response = await getEventAttendees(eventId, { 
        per_page: pagination.per_page,
        page: pagination.current_page,
        search_for: searchTerm || undefined 
      });
      
      if (response.success) {
        setAttendees(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination(prev => ({ ...prev, per_page: perPage, current_page: 1 }));
  };

  const formatRegistrationDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy • HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
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

  if (loading && attendees.length === 0) {
    return (
      <div className="space-y-4">
        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full max-w-md" />
        
        {/* Attendee Cards Skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Attendees
            <Badge variant="secondary" className="ml-2">
              {pagination.total}
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {pagination.from}-{pagination.to} of {pagination.total} attendees
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
            <Select
              value={pagination.per_page.toString()}
              onValueChange={(value) => handlePerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 order-1 sm:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Attendees List */}
      {filteredAttendees.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              {searchTerm ? (
                <>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No matching attendees
                  </h3>
                  <p className="text-gray-500">
                    No attendees found matching "{searchTerm}"
                  </p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No attendees yet
                  </h3>
                  <p className="text-gray-500">
                    Register the first attendee to get started.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {filteredAttendees.map((attendee, index) => (
              <Card key={attendee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {/* Avatar Placeholder */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Attendee Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg truncate">
                            {attendee.name}
                          </h4>
                          <Badge variant="outline" className="text-xs w-fit">
                            #{(pagination.current_page - 1) * pagination.per_page + index + 1}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{attendee.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>Registered {formatRegistrationDate(attendee.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge - Now properly positioned for mobile */}
                    <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-1">
                      <Badge variant="secondary" className="flex-shrink-0 text-xs">
                        Registered
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.from}-{pagination.to} of {pagination.total} attendees
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

              {/* Items Per Page Selector (Duplicate for bottom) */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Show:</span>
                <Select
                  value={pagination.per_page.toString()}
                  onValueChange={(value) => handlePerPageChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">per page</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
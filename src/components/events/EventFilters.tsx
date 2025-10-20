'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getTimezoneOptions } from '@/lib/timezones';
import { EventFilters as EventFiltersType } from '@/types';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
  availableLocations: string[];
}

const defaultFilters: EventFiltersType = {
  timezone: 'Asia/Kolkata',
  page: 1,
  per_page: 10,
  sort_by: 'start_time',
  sort_order: 'asc',
  search_in: 'all',
  seat_available_events: false,
};

const sortOptions = [
  { value: 'name', label: 'Event Name', icon: '📝' },
  { value: 'location', label: 'Location', icon: '📍' },
  { value: 'start_time', label: 'Start Time', icon: '⏰' },
  { value: 'end_time', label: 'End Time', icon: '🕒' },
  { value: 'max_capacity', label: 'Max Capacity', icon: '👥' },
  { value: 'current_attendees', label: 'Current Attendees', icon: '✅' },
];

const searchInOptions = [
  { value: 'all', label: 'All Fields', icon: '🔍' },
  { value: 'name', label: 'Event Name', icon: '📝' },
  { value: 'location', label: 'Location', icon: '📍' },
  { value: 'start_time', label: 'Start Date', icon: '⏰' },
  { value: 'end_time', label: 'End Date', icon: '🕒' },
  { value: 'max_capacity', label: 'Max Capacity', icon: '👥' },
  { value: 'current_attendees', label: 'Current Attendees', icon: '✅' },
];

export function EventFilters({
  filters,
  onFiltersChange,
  availableLocations,
}: EventFiltersProps) {
  const [localFilters, setLocalFilters] = useState<EventFiltersType>(filters);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const hasActiveFilters = 
    filters.search_for ||
    (filters.filter_by_location && filters.filter_by_location.length > 0) ||
    filters.seat_available_events ||
    filters.sort_by !== 'start_time' ||
    filters.sort_order !== 'asc' ||
    filters.search_in !== 'name';

  const handleFilterChange = (key: keyof EventFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsSheetOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = { ...defaultFilters, timezone: filters.timezone };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsSheetOpen(false);
  };

  const removeFilter = (filterKey: keyof EventFiltersType, value?: string) => {
    let newFilters = { ...filters };
    
    if (filterKey === 'filter_by_location' && value) {
      newFilters.filter_by_location = filters.filter_by_location?.filter(loc => loc !== value);
    } else if (filterKey === 'search_for') {
      newFilters.search_for = undefined;
    } else if (filterKey === 'seat_available_events') {
      newFilters.seat_available_events = false;
    } else if (filterKey === 'sort_by') {
      newFilters.sort_by = 'start_time';
    } else if (filterKey === 'sort_order') {
      newFilters.sort_order = 'asc';
    } else if (filterKey === 'search_in') {
      newFilters.search_in = 'name';
    }
    
    onFiltersChange({ ...newFilters, page: 1 });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search_for) count++;
    if (filters.filter_by_location && filters.filter_by_location.length > 0) count++;
    if (filters.seat_available_events) count++;
    if (filters.sort_by !== 'start_time') count++;
    if (filters.sort_order !== 'asc') count++;
    if (filters.search_in !== 'name') count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by name, location, date..."
              value={localFilters.search_for || ''}
              onChange={(e) => handleFilterChange('search_for', e.target.value)}
              className="pl-10 pr-4 py-2 h-10 rounded-lg border-input bg-background"
            />
          </div>
          
          {/* Search In Dropdown 
          <Select
            value={localFilters.search_in}
            onValueChange={(value) => handleFilterChange('search_in', value)}
          >
            <SelectTrigger className="w-[160px] h-10 rounded-lg">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              {searchInOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                  <span className="text-sm">{option.icon}</span>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* Timezone Dropdown */}
          <Select
            value={localFilters.timezone}
            onValueChange={(value) => handleFilterChange('timezone', value)}
          >
            <SelectTrigger className="w-[200px] h-10 rounded-lg">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getTimezoneOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Button */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 rounded-lg gap-2 relative">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="sm:max-w-md w-full overflow-y-auto rounded-l-2xl border-l border-gray-200 bg-white shadow-xl"
          >
            <SheetHeader className="border-b pb-4 mb-2">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <SlidersHorizontal className="h-5 w-5" />
                Advanced Filters
              </SheetTitle>
              <SheetDescription>
                Refine your event search with precision filters
              </SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8">
              {/* Sort Options Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  <Label className="text-base font-semibold">Sorting</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select
                      value={localFilters.sort_by}
                      onValueChange={(value) => handleFilterChange('sort_by', value)}
                    >
                      <SelectTrigger className="w-full rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Order</Label>
                    <Select
                      value={localFilters.sort_order}
                      onValueChange={(value) => handleFilterChange('sort_order', value)}
                    >
                      <SelectTrigger className="w-full rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc" className="flex items-center gap-2">
                          <span>⬆️</span>
                          Ascending
                        </SelectItem>
                        <SelectItem value="desc" className="flex items-center gap-2">
                          <span>⬇️</span>
                          Descending
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Filter Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <Label className="text-base font-semibold">Locations</Label>
                </div>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">
                  {availableLocations.length > 0 ? (
                    availableLocations.map(location => (
                      <div key={location} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <Checkbox
                          id={`location-${location}`}
                          checked={localFilters.filter_by_location?.includes(location) || false}
                          onCheckedChange={(checked) => {
                            const currentLocations = localFilters.filter_by_location || [];
                            const newLocations = checked
                              ? [...currentLocations, location]
                              : currentLocations.filter(loc => loc !== location);
                            handleFilterChange('filter_by_location', newLocations);
                          }}
                        />
                        <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer flex-1">
                          {location}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No locations available
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Availability Filter Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label className="text-base font-semibold">Availability</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="available-seats"
                    checked={localFilters.seat_available_events}
                    onCheckedChange={(checked) => 
                      handleFilterChange('seat_available_events', checked === true)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="available-seats" className="cursor-pointer font-medium">
                      Show only events with available seats
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Filter out fully booked events
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Display Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Display</Label>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Items Per Page</Label>
                  <Select
                    value={localFilters.per_page.toString()}
                    onValueChange={(value) => handleFilterChange('per_page', parseInt(value))}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 items</SelectItem>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="15">15 items</SelectItem>
                      <SelectItem value="20">20 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t gap-3">
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="flex-1 rounded-lg"
              >
                Reset All
              </Button>
              <Button 
                onClick={handleApplyFilters}
                className="flex-1 rounded-lg"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground mr-2">Active filters:</span>
          {filters.search_for && (
            <Badge variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1">
              🔍 "{filters.search_for}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter('search_for')}
              />
            </Badge>
          )}
          
          {filters.filter_by_location?.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1">
              📍 {location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter('filter_by_location', location)}
              />
            </Badge>
          ))}
          
          {filters.seat_available_events && (
            <Badge variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1">
              ✅ Available Seats Only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter('seat_available_events')}
              />
            </Badge>
          )}
          
          {filters.sort_by !== 'start_time' && (
            <Badge variant="secondary" className="flex items-center gap-1 pl-3 pr-2 py-1">
              🔄 {sortOptions.find(opt => opt.value === filters.sort_by)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter('sort_by')}
              />
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
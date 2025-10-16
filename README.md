# Event Management System - Frontend

A modern, responsive Next.js frontend application for managing events and attendees, built with TypeScript and Shadcn UI components.

## 🚀 Live Deployment

- **Frontend Application**: [https://omnify-event-management-app.vercel.app/dashboard](https://omnify-event-management-app.vercel.app/dashboard)
- **Backend API**: [https://omnify-event-management-app-server.onrender.com/api](https://omnify-event-management-app-server.onrender.com/api)
- **API Documentation**: [View Swagger Docs](https://omnify-event-management-app-server.onrender.com/swagger-live)

## 📋 Features Implemented

### 🎯 Core Features
✅ **Event Management**
- Create new events with comprehensive details
- View all upcoming events in an intuitive grid layout
- Event capacity tracking with visual progress indicators
- Timezone-aware event timing display

✅ **Attendee Management**
- Register attendees for specific events
- Prevent duplicate email registrations per event
- View paginated attendee lists with search functionality
- Real-time capacity validation

✅ **Advanced Features**
- **Advanced Filtering & Search**: Multi-criteria event filtering
- **Timezone Support**: Display events in any timezone
- **Responsive Design**: Mobile-first approach
- **Real-time Validation**: Form validation with user-friendly error messages
- **Loading States**: Skeleton loaders and progress indicators

### 🛠️ Technical Features
✅ **Modern Stack**
- Next.js 15.5.5 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- React Hook Form with Zod validation

✅ **State Management**
- Custom hooks for API interactions
- Local state management with React hooks
- Optimistic UI updates

✅ **Performance**
- Client-side rendering with efficient re-renders
- Pagination for large datasets
- Debounced search functionality
- Optimized API calls

## 🏗️ Architecture & Design

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/
│   ├── attendees/         # Attendee-related components
│   ├── events/           # Event-related components
│   ├── ui/               # Shadcn UI components
│   └── hooks/            # Custom React hooks
├── lib/
│   ├── api.ts           # API client configuration
│   ├── validations.ts   # Zod validation schemas
│   ├── timezones.ts     # Timezone utilities
│   └── utils.ts         # Utility functions
└── types/
    └── index.ts         # TypeScript type definitions
```

### Key Components

**Event Management Components**
- `EventList` - Displays paginated events with filtering
- `CreateEventDialog` - Modal for creating new events
- `EventFilters` - Advanced filtering and search interface
- `EventDetail` - Detailed event view with statistics

**Attendee Management Components**
- `AttendeeList` - Paginated attendee list with search
- `RegisterAttendeeDialog` - Modal for attendee registration
- `RegisterAttendeeForm` - Form with validation

**UI Components**
- Custom hooks (`useApi`) for API state management
- Responsive layouts with Tailwind CSS
- Accessible form components from Shadcn UI

## 🎨 User Interface Features

### Dashboard Overview
- **Event Grid**: Card-based layout showing event details
- **Quick Actions**: Create event and register attendee buttons
- **Real-time Stats**: Capacity indicators and registration counts

### Advanced Filtering System
- **Search**: Across multiple fields (name, location, date, capacity)
- **Sorting**: By name, location, timing, capacity, attendees
- **Location Filtering**: Multi-select location filtering
- **Availability Filtering**: Show only events with available seats
- **Timezone Selection**: Display events in preferred timezone

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Progressive Enhancement**: Core functionality works without JavaScript

## 🔧 API Integration

### Backend Communication
```typescript
// Example API integration
const { createEvent, getEvents, registerAttendee } = useApi();

// Create event
await createEvent({
  name: 'Tech Conference',
  location: 'Bangalore',
  start_time: '2024-12-20 10:00:00',
  end_time: '2024-12-20 17:00:00',
  max_capacity: 100
});

// Get events with filters
const events = await getEvents({
  search_for: 'conference',
  filter_by_location: ['Bangalore'],
  seat_available_events: true
});
```

### Error Handling
- Structured error responses
- User-friendly error messages
- Validation error display
- Network error fallbacks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd event-management-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://omnify-event-management-app-server.onrender.com/api
NEXT_PUBLIC_APP_NAME=Event Management System
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Key Pages & Features

### Dashboard (`/dashboard`)
- Overview of all upcoming events
- Quick event creation
- Advanced filtering and search
- Event capacity visualization

### Event Detail (`/dashboard/events/[id]`)
- Complete event information
- Attendee management section
- Registration functionality
- Capacity tracking

### Component Features

**Event Filters**
- Real-time search with debouncing
- Multi-criteria filtering
- Sort options with visual indicators
- Filter badge system

**Attendee Management**
- Paginated lists with search
- Email validation
- Duplicate registration prevention
- Registration success feedback

## 🎯 Design Principles

### User Experience
- **Intuitive Navigation**: Clear hierarchy and breadcrumbs
- **Progressive Disclosure**: Advanced features available but not overwhelming
- **Immediate Feedback**: Loading states, success messages, error handling
- **Accessibility**: WCAG compliant components

### Performance
- **Efficient Rendering**: Optimized re-renders with proper hooks usage
- **Lazy Loading**: Components loaded as needed
- **Optimized Images**: Next.js Image component
- **Bundle Optimization**: Tree-shaking and code splitting

### Code Quality
- **Type Safety**: Comprehensive TypeScript coverage
- **Component Reusability**: Modular, reusable components
- **Consistent Styling**: Tailwind CSS with design tokens
- **Testing Ready**: Structured for easy testing implementation

## 🔄 State Management

### Custom Hooks
```typescript
// useApi hook provides:
const {
  loading,          // Current loading state
  error,           // Error message if any
  createEvent,     // Event creation method
  getEvents,       // Event fetching method
  registerAttendee, // Attendee registration
  getEventAttendees // Attendee list fetching
} = useApi();
```

### Local State
- Form state management with React Hook Form
- Filter state with URL persistence
- Pagination state management
- UI state (modals, loading states)

## 🛡️ Error Handling & Validation

### Client-Side Validation
- Zod schema validation for all forms
- Real-time field validation
- Custom validation messages
- Cross-field validation (e.g., end time after start time)

### Error Boundaries
- Graceful error handling
- User-friendly error messages
- Fallback UI components
- Error reporting and logging

## 📦 Dependencies

### Core Dependencies
- **Next.js 15.5.5**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Accessible component library

### Key Libraries
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation
- **date-fns**: Date manipulation and formatting
- **Axios**: HTTP client for API calls

## 🚀 Deployment

### Vercel Deployment
The application is deployed on Vercel with:
- Automatic deployments from main branch
- Environment variable configuration
- CDN distribution for global performance
- SSL encryption

### Build Optimization
- Static generation where possible
- Image optimization
- CSS and JavaScript minification
- Bundle analysis and optimization

## 🔮 Future Enhancements

### Planned Features
- Real-time updates with WebSockets
- Advanced analytics and reporting
- Bulk attendee registration
- Email notifications
- Calendar integration
- Mobile app version

### Technical Improvements
- Comprehensive test coverage
- Performance monitoring
- Advanced caching strategies
- PWA capabilities

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit pull request

### Code Standards
- TypeScript for all new code
- ESLint and Prettier configuration
- Component story development
- Accessibility testing

---

## 📞 Support

For issues and questions:
- Check the [API Documentation](https://omnify-event-management-app-server.onrender.com/swagger-live)
- Review component documentation
- Check network tab for API errors
- Verify environment configuration

---

**Built with ❤️ using Next.js, TypeScript, and Shadcn UI**
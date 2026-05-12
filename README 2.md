# Return Home Project - Community Task Management System

A full-stack web application for managing community projects with multiple stakeholders, task dependencies, and WhatsApp-based notifications. Designed with a calm, non-stressful UI for sensitive real-world projects.

## Features

### User Roles
- **Super Admin (Project Manager)**: Full system access
- **Domain Manager (Team Leader)**: Manage domains and team members
- **Task Owner (User)**: Own and update assigned tasks
- **Viewer (Optional)**: View-only access

### Task Management
- Create/edit/delete tasks with timeline, budget, and urgency
- Task dependencies (blocking/predecessor tasks)
- Status tracking: Not Started, In Progress, Completed, Blocked, Late
- Urgency levels: Green (Low), Orange (Medium), Red (High)
- Auto-updating urgency based on deadline proximity
- Days-only countdown (no stressful hours/minutes)

### Dashboard Views
- Personal task dashboard with filters
- Manager overview with statistics
- Timeline/Gantt view with dependencies
- Domain-based organization
- Budget tracking

### Notifications
- WhatsApp integration (Twilio)
- In-app notifications
- Triggers: New task, status change, deadline approaching, dependency released

### UI/UX
- Clean, calm design (sand/sage color palette)
- RTL support for Hebrew
- Mobile-first responsive design
- Non-stressful interface

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL, Prisma ORM
- **Notifications**: Twilio (WhatsApp)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Twilio account (for WhatsApp notifications)

## Setup Instructions

### 1. Clone and Install

```bash
cd "app project managment"
npm install
```

### 2. Database Setup

Create a PostgreSQL database and set the connection string:

```bash
# Create .env file
cp .env.example .env

# Edit .env with your database URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/return_home_project"
```

### 3. Database Migration and Seed

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 4. Configure Environment Variables

Edit `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/return_home_project"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Twilio (Optional - for WhatsApp notifications)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"

# App
APP_NAME="Return Home Project"
APP_URL="http://localhost:3000"
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Demo Credentials

After seeding, you can log in with:

- **Admin**: `admin@example.com` / `admin123`
- **Manager**: `manager@example.com` / `manager123`
- **User**: `user1@example.com` / `user123`

## Project Structure

```
├── app/
│   ├── api/           # API routes (Next.js)
│   ├── dashboard/     # User dashboard
│   ├── login/         # Login page
│   ├── manager/       # Admin/manager pages
│   ├── tasks/         # Task pages
│   ├── timeline/      # Timeline view
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/
│   ├── dashboard/     # Dashboard components
│   ├── tasks/         # Task components
│   └── providers/     # Context providers
├── lib/
│   ├── db.ts          # Database client
│   ├── utils.ts       # Utility functions
│   └── notifications.ts # Notification service
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── seed.ts        # Seed data
├── middleware.ts      # Auth middleware
└── package.json
```

## Key Features Implementation

### Task Dependencies
- Tasks can have dependencies that must be completed first
- Blocked tasks are visually indicated
- Dependencies are enforced when marking tasks as complete

### Notifications
- In-app notifications are always created
- WhatsApp notifications sent via Twilio when phone numbers are available
- Smart triggers prevent notification spam

### Business Logic
- Tasks automatically marked "Late" when due date passes
- Urgency auto-updates based on days remaining
- Dependencies block task completion
- Countdown shows days only (no hours/minutes)

### Security
- Role-based access control (RBAC)
- Middleware protects routes based on user roles
- Password hashing with bcrypt
- Session-based authentication

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set for production:

- `DATABASE_URL`: Production PostgreSQL database
- `NEXTAUTH_SECRET`: Strong random string
- `NEXTAUTH_URL`: Your production URL
- `TWILIO_*`: For WhatsApp notifications

### Database Migration in Production

```bash
npx prisma migrate deploy
```

## Customization

### Adding New Domains
Domains can be added via the admin panel or seeded into the database.

### Customizing Colors
Edit the Tailwind config in `tailwind.config.ts` to adjust the color palette.

### Localization
The app is currently set up for Hebrew (RTL). To add other languages:
1. Update the i18n config in `next.config.js`
2. Add translation files
3. Update text throughout the components

## API Endpoints

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Domains
- `GET /api/domains` - List domains
- `POST /api/domains` - Create domain

### Users (via NextAuth)
- `POST /api/auth/[...nextauth]` - Authentication

## Future Enhancements

- [ ] AI assistant for detecting stuck tasks
- [ ] Map view for location-based tasks
- [ ] File upload system
- [ ] Email notifications
- [ ] Calendar integration (Google Calendar)
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)

## License

MIT License - feel free to use for community projects.

## Support

For issues or questions, please contact the project administrator.

---

Built with care for community projects. 🏠

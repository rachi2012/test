# Team Task Manager

A premium, full-stack web application for project and task management with role-based access control.

## Features

- **Authentication**: Secure signup/login with JWT and password hashing (bcrypt).
- **Role-Based Access Control**:
  - **Admin**: Create/manage projects, assign tasks to members, manage team.
  - **Member**: View assigned projects/tasks, update task status.
- **Project Management**: Group tasks by project, track project status.
- **Task Management**: Prioritize tasks, set due dates, filter by status/priority.
- **Dashboard**: Real-time stats on projects, tasks, and overdue items.
- **Premium UI**: Clean, responsive design with Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Zod Validation.
- **Deployment**: Prepared for Railway.

## Folder Structure

```text
root/
  client/       # React Frontend
    src/
      components/ # Reusable UI & Layout
      pages/      # View components
      context/    # Auth state management
      services/   # API communication
  server/       # Express Backend
    src/
      models/      # Mongoose schemas
      controllers/ # Business logic
      routes/      # API endpoints
      middleware/  # Auth & Validation
      validations/ # Zod schemas
```

## Setup Instructions

### Backend Setup
1. Navigate to `server/`: `cd server`
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example` and add your `MONGO_URI` and `JWT_SECRET`.
4. Seed demo data: `npm run seed`
5. Start server: `npm run dev`

### Frontend Setup
1. Navigate to `client/`: `cd client`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Demo Credentials

- **Admin**: `admin@test.com` / `Admin@123`
- **Member**: `member@test.com` / `Member@123`

## API Endpoints Summary

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`
- **Tasks**: `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id/status`
- **Dashboard**: `GET /api/dashboard/stats`

## Railway Deployment

1. Connect your GitHub repo to Railway.
2. Add environment variables in Railway dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend URL)
3. Ensure the root contains both `client` and `server` or deploy them as separate services.
# ertha1
# assignment-

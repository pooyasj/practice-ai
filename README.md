# User Management System (practice-ai)

A modern, responsive user management dashboard built with Next.js, featuring real-time search, sorting, and full CRUD capabilities (Add/Delete) using a local JSON data store.

## 🚀 Overview

This project serves as a practice platform for implementing advanced Next.js patterns, including the App Router, Server Components, Client Components, and Server Actions. It provides a clean interface for managing a user database with optimistic UI updates and robust error handling.

## ✨ Features

- **User Table**: Displays user information (Username, Email, Role, Status).
- **Search**: Filter users by username or email in real-time.
- **Sorting**: Toggle alphabetical sorting by username (Ascending, Descending, None).
- **Add User**: Modal-based form to create new users with auto-generated UUIDs.
- **Delete User**: Secure deletion with a confirmation modal and focus management.
- **Optimistic UI**: Immediate interface updates on Add/Delete actions with automatic rollback on failure.
- **Responsive Design**: Fully responsive layout optimized for various screen sizes using Tailwind CSS.
- **Type Safety**: End-to-end TypeScript implementation for reliable development.

## 🏗️ Architecture & Decisions

### Framework & Styling
- **Next.js 16.1.6 (App Router)**: Leverages the latest routing and rendering capabilities.
- **Tailwind CSS 4**: Utilizes the modern utility-first CSS framework for rapid UI development.
- **Lucide React**: For consistent and accessible iconography.

### Data Handling
- **Data Source**: A local `data.json` file serves as the persistent data store.
- **Fetching**: Data is read directly from the file system in a **Server Component** (`components/UsersTable.tsx`) to minimize client-side fetching overhead.
- **Mutations**: **Server Actions** (`lib/actions.ts`) handle file system writes for adding and deleting users, utilizing `revalidatePath` to keep the UI in sync.
- **State Management**: Client-side state in `UsersTableClient` manages search, sorting, and optimistic updates while the server remains the source of truth.

### Component Strategy
- **Hybrid Approach**: Server Components are used for data fetching, while Client Components (`'use client'`) handle interactive elements like modals, search, and sort.
- **Accessibility**: Implements focus management (returning focus after modal closure) and semantic HTML.

## 📁 Project Structure

```text
practice-ai/
├── app/                # Next.js App Router (Pages, Layouts, Global CSS)
├── components/         # React Components (UI, Table, Modals)
├── lib/                # Utility functions and Server Actions
├── public/             # Static assets
├── scripts/            # Development and maintenance scripts
├── data.json           # Local JSON database
├── guideline.md        # Technical project guidelines
└── README.md           # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

### Production
Build the application for production:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```

### Other Scripts
- `npm run lint`: Run ESLint to check code quality.
- `npm run sync-guideline`: Synchronize the technical guidelines with the current project state.

## ⚠️ Constraints & Design Decisions

- **Local Persistence**: Data persistence is achieved via `data.json`. This is suitable for development and small-scale practice but would be replaced by a database in a production environment.
- **Optimistic UI**: The app prioritizes responsiveness by updating the UI before the server confirms the action. Rollback logic is implemented to handle server errors gracefully.
- **Server-First**: The project follows a "Server-First" philosophy, keeping as much logic as possible on the server to reduce client-side bundle size.

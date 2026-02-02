# Project Guideline

This document serves as the authoritative source of truth for the `practice-ai` project. It provides an overview of the project's architecture, conventions, and workflows to ensure consistency and ease of onboarding.

## 1. Project Overview and Goals

`practice-ai` is a modern web application built with Next.js. The project aims to provide a robust and scalable foundation for AI-related practice and experimentation.

### Core Goals:
-   **Modernity**: Utilize the latest features of Next.js, React, and Tailwind CSS.
-   **Type Safety**: Ensure end-to-end type safety using TypeScript.
-   **Performance**: Optimize for speed and efficiency using Next.js built-in optimizations (fonts, images, etc.).
-   **Maintainability**: Follow clear folder structures and coding standards.

## 2. Core Concepts and Architecture

The project follows the **Next.js App Router** architecture.

-   **Framework**: [Next.js 16.1.6](https://nextjs.org/)
-   **Styling**: [Tailwind CSS ^4](https://tailwindcss.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Runtime**: Node.js

### Key Architectural Pillars:
-   **Server-First**: Leverage React Server Components (RSC) by default for better performance and reduced client-side JavaScript.
-   **Route-Based Layouts**: Use `layout.tsx` for shared UI across different routes.
-   **Static & Dynamic Rendering**: Use Next.js caching and rendering strategies to balance speed and freshness.

## 3. Folder and File Structure

```text
practice-ai/
├── app/                # Main application logic (App Router)
│   ├── favicon.ico     # App icon
│   ├── globals.css     # Global Tailwind styles
│   ├── layout.tsx      # Root layout (fonts, metadata, html/body)
│   └── page.tsx        # Home page entry point
├── public/             # Static assets (images, robots.txt, etc.)
├── eslint.config.mjs   # ESLint configuration (Flat Config)
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.mjs  # PostCSS configuration for Tailwind CSS
├── tsconfig.json       # TypeScript configuration
└── guideline.md        # This documentation
```

## 4. Key Workflows and Usage Instructions

### Development
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run start
```

### Linting
To check for code quality and style issues:
```bash
npm run lint
```

## 5. Design Decisions and Conventions

-   **Naming Conventions**: 
    -   Components: PascalCase (e.g., `MyComponent.tsx`).
    -   Files/Folders: kebab-case (except for Next.js special files like `layout.tsx`).
-   **Component Structure**: 
    -   Prefer functional components with arrow functions.
    -   Use `export default` for pages and layouts as required by Next.js.
-   **Styling**: 
    -   Use Tailwind CSS utility classes directly in `className`.
    -   Avoid custom CSS unless absolutely necessary (defined in `globals.css`).
-   **Fonts**: 
    -   Uses `next/font` for optimized loading of Geist and Geist Mono.

## 6. Best Practices and Constraints

-   **Server Components**: Keep components as Server Components by default. Only use `'use client'` when interactivity or browser APIs are required.
-   **Metadata**: Define metadata in `layout.tsx` or `page.tsx` for SEO optimization.
-   **TypeScript**: Avoid `any`. Use interfaces and types for all props and state.
-   **Imports**: Use absolute imports if configured (check `tsconfig.json`).

## 7. Implicit Rules and Patterns

-   **Hydration**: Be mindful of hydration mismatches by ensuring server and client rendered content match.
-   **Project State**: The project is currently in a "fresh start" state, with `app/page.tsx` being a clean slate for development.

## 8. How this file is kept up to date

This document is a **living document** and is automatically kept in sync with the codebase.

-   **Automation**: A synchronization script (`scripts/sync-guideline.mjs`) runs to update folder structures, dependency versions, and timestamps.
-   **Verification**: The `npm run check-guideline` command is used in CI/CD and pre-commit hooks to ensure the documentation reflects the current state of the project.
-   **Manual Updates**: While structural changes are automated, architectural decisions and conventions should be updated manually in sections 2, 5, and 6.

---

*Last Updated: 2026-02-02 08:58:46 (Auto-synced)*

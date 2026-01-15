# ShowSpotter – TV Show Search & Favorites App

A React-based web application that allows users to search for TV shows, view detailed information, and manage a personalized favorites list. Built with modern web technologies for a seamless user experience.

## Features

- **Show Search**: Search for TV shows by title using the TVMaze API
- **Pagination & Infinite Scroll**: Automatically load more shows as you scroll to the bottom
- **Show Details Modal**: Click on any show to view comprehensive information including synopsis, ratings, genres, schedule, and network details
- **Favorites Management**: Add or remove shows from your favorites list with persistent storage using localStorage
- **Responsive Design**: Fully responsive grid layout that adapts to different screen sizes
- **HTML Sanitization**: Secure handling of API-provided HTML content to prevent XSS attacks

## Technologies & Libraries

### Core Framework
- **React 19** – UI library with Hooks for state management
- **TypeScript** – Type-safe development
- **Vite** – Fast build tool with HMR (Hot Module Replacement)

### Styling
- **Tailwind CSS** – Utility-first CSS framework
- **DaisyUI** – Pre-built Tailwind components

### API & Data
- **TVMaze API** – TV show data source
- **Fetch API** – HTTP requests

### Security & Utilities
- **DOMPurify** – HTML sanitization to prevent XSS attacks
- **ESLint** – Code quality and consistency
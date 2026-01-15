# ShowSpotter – Technical Decisions Document

## Overview
This document outlines key architectural and technical decisions made for the ShowSpotter application, including state management, data persistence, pagination, and alternatives considered.

---

## 1. State Management

### Decision: React Hooks (useState)
We opted to use **React Hooks (useState)** for managing application state rather than more complex solutions.

### Rationale
- **Scope-appropriate**: The application has a relatively simple state structure (shows list, favorites, search term, loading/error states, modal visibility)
- **Minimal overhead**: Direct prop passing is sufficient for the component hierarchy depth
- **Performance**: No unnecessary re-renders or complex subscription logic
- **Developer experience**: Hooks are intuitive, require minimal boilerplate, and align with modern React patterns

### State managed with useState:
- `shows` – List of fetched TV shows
- `favorites` – User's favorited shows
- `search` – Current search term
- `loading` / `error` – Async operation states
- `view` – Current tab (search vs. favorites)
- `showDetail` – Selected show's detailed information
- `page` – Current pagination page
- `initialized` – Favorites initialization flag

### Alternatives Considered (Not Implemented)
- **Context API**: Would add unnecessary complexity for prop drilling that doesn't exist at our current scale
- **useReducer**: Better suited for applications with complex state transitions or interdependent state updates
- **Redux Toolkit**: Enterprise-grade solution, overkill for this project's scope
- **Zustand**: Lightweight alternative, but not needed given our shallow component tree and simple state dependencies

---

## 2. Data Persistence

### Decision: localStorage API
We use the browser's **localStorage API** to persist the user's favorites list.

### Rationale
- **User expectations**: Favorites should persist across browser sessions without server infrastructure
- **Simplicity**: No backend required; data stored locally on the user's device
- **Performance**: Instant read/write operations, no network latency
- **Adequate for scope**: Suitable for client-side preferences in a course project

### Implementation Details
- Favorites are serialized to JSON and stored under the key `'favorites'`
- Restored on app initialization via `useEffect`
- Automatically synced whenever the favorites list changes
- Graceful fallback: If no stored favorites exist, defaults to an empty array

### Limitations & Future Considerations
- **Storage limit**: localStorage has a ~5-10MB limit per domain (sufficient for this use case)
- **No cross-device sync**: Users would need cloud-based sync for multi-device support
- **No user accounts**: Current implementation doesn't support multiple users on the same device
- **Future**: Could migrate to a backend API with user authentication for cloud persistence

---

## 3. Pagination & Infinite Scroll

### Decision: TVMaze API Pagination + Intersection Observer API
We combined the TVMaze API's built-in pagination (`/shows?page=${page}`) with the **Intersection Observer API** to implement infinite scroll functionality.

### How It Works
1. **API Pagination**: The TVMaze endpoint returns paginated results (typically 250 shows per page)
2. **Intersection Observer**: A sentinel `<div>` element placed at the bottom of the show grid
3. **Auto-load trigger**: When the sentinel enters the viewport, `page` increments automatically
4. **Append logic**: New shows are appended to the existing list (not replacing it)
5. **Scroll preservation**: After fetching, the page scrolls to the bottom to keep new content in view

### Rationale
- **User experience**: Seamless "infinite scroll" without explicit "Load More" buttons
- **Performance**: Intersection Observer is asynchronous and efficient (no constant scroll event listeners)
- **Controlled data flow**: API endpoint manages pagination, reducing memory bloat
- **Search isolation**: Pagination only activates in "search view" with empty search term; searches replace the entire list

### Conditional Behavior
- **Pagination mode**: Active when `view === 'search'` AND `search === ''`; appends shows and scrolls to bottom
- **Search mode**: When a search term is entered, pagination is disabled and results replace the entire list
- **Error/Loading states**: Observer disconnects when loading or error is true, preventing race conditions

---

## 4. Data Fetching Architecture

### Decision: Service Layer with Sanitization
We encapsulated all API calls in a dedicated `services/shows.ts` file with built-in HTML sanitization.

### Benefits
- **Separation of concerns**: API logic isolated from React components
- **Reusability**: Services can be called from multiple components or hooks
- **Security**: HTML sanitization (DOMPurify) applied at the source before data reaches components
- **Maintainability**: Changes to API endpoints or data transformations happen in one place
- **Type safety**: TypeScript interfaces ensure consistent data shapes

### Service Functions
- `searchShowsBySearch(search)` – Search shows by title
- `searchShowsByPage(page)` – Fetch shows by page number
- `searchShowByDetail(showId)` – Fetch comprehensive show details
- `sanitizeHTML(html)` – DOMPurify sanitization utility

---

## 5. Security: HTML Sanitization

### Decision: DOMPurify for XSS Prevention
We use the **DOMPurify** library to sanitize HTML content from the TVMaze API before rendering.

### Rationale
- **Risk mitigation**: API responses contain user-generated or third-party HTML in the `summary` field
- **XSS prevention**: Malicious scripts or event handlers could be injected if content isn't sanitized
- **Industry standard**: DOMPurify is battle-tested, widely used, and actively maintained
- **Balance**: Preserves safe HTML tags (e.g., `<p>`, `<strong>`, `<em>`) while removing dangerous attributes

Applied to all summary fields before storage/display.

---

## 6. Styling & Responsive Design

### Decision: Tailwind CSS + DaisyUI
We use **Tailwind CSS** as the utility-first CSS framework and **DaisyUI** as a component library built on top of Tailwind.

### Rationale

#### Tailwind CSS
- **Utility-first approach**: Build responsive designs without leaving HTML/JSX, reducing context switching
- **Minimal CSS output**: Only includes styles that are used, resulting in smaller bundle sizes
- **Consistency**: Predefined color palettes, spacing scales, and typography ensure design cohesion
- **Rapid development**: Faster iteration by composing utility classes directly in markup
- **Customizable**: `tailwind.config.js` allows easy theme modifications and extensions

#### DaisyUI
- **Pre-built components**: Reduces boilerplate by providing ready-made components (buttons, cards, modals, tabs, spinners)
- **Accessibility**: Components follow WAI-ARIA standards out of the box
- **Consistency**: Enforces consistent styling across the application without custom CSS
- **Lightweight**: Minimal overhead (~10KB) compared to heavier component libraries

### Implementation
- **Grid layout**: Responsive show grid using `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- **Tabs component**: DaisyUI `tabs` component for search/favorites navigation
- **Modal**: DaisyUI modal for show detail view
- **Buttons & inputs**: DaisyUI button and input components for consistency
- **Spinner & alerts**: Custom or DaisyUI loading and error message components
- **Responsive breakpoints**: Mobile-first design with Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

---

## 7. Alternative Approach: TanStack Query (React Query)

### Consideration: TanStack Query for Data Management & Caching
**TanStack Query** (formerly React Query) is a robust alternative for handling server state, caching, synchronization, and pagination.

### Recommendation
Consider migrating to TanStack Query if/when:
- Multiple independent API sources are added
- Search/filter combinations create complex caching scenarios
- Performance issues emerge with large datasets
- Team prioritizes standardized async state management

---

## 8. Component Architecture

### Decision: Functional Components with Props
All components follow React's modern functional component pattern with prop-based communication.

### Component Hierarchy
```
App (root state)
├── SearchBar (controlled input)
├── ShowCard (presentational, receives show + callbacks)
├── ShowDetailModal (modal overlay, receives detail + handlers)
├── Spinner (loading indicator)
└── ErrorMessage (error display)
```
---

## 9. Performance Considerations

### Optimizations Implemented
1. **Intersection Observer**: More efficient than scroll event listeners
2. **Conditional rendering**: Modals and spinners only render when needed
3. **Memoization potential**: Future optimization using `React.memo()` for ShowCard if re-renders become excessive
4. **Sentinel element**: Single observer instance instead of per-item listeners

---

## Conclusion

ShowSpotter's architecture prioritizes **simplicity, clarity, and appropriateness to scope**. The technology stack is intentionally minimal, using vanilla React patterns without over-engineering. As the project grows, decisions documented here can be revisited to introduce more sophisticated patterns (Context API, TanStack Query, state machines) without disrupting the current foundation.
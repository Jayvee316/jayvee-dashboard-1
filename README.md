# Jayvee Dashboard

A modern Angular dashboard application featuring a glassmorphism UI design with JWT authentication, connecting to a C# ASP.NET Core backend.

## Features

- **Glassmorphism UI** - Frosted glass effects, blur, gradients, and modern aesthetics
- **Collapsible Sidebar** - Navigation with icons, labels, and badges
- **JWT Authentication** - Secure login with token-based authentication
- **Route Guards** - Protected routes with automatic redirect to login
- **Lazy Loading** - All pages are lazy-loaded for optimal performance
- **Responsive Design** - Works on desktop and mobile devices
- **Signal-based State** - Modern Angular signals for reactive state management

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.x | Frontend framework |
| TypeScript | 5.x | Type-safe JavaScript |
| RxJS | 7.x | Reactive programming |
| Angular Signals | - | State management |

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/          # Main layout wrapper
│   │   └── sidebar/         # Collapsible navigation sidebar
│   ├── guards/
│   │   └── auth.guard.ts    # Route protection (authGuard, guestGuard, adminGuard)
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # JWT token injection
│   ├── pages/
│   │   ├── blog/            # Blog page
│   │   ├── dashboard/       # Main dashboard
│   │   ├── login/           # Login page
│   │   ├── messages/        # Messages page
│   │   ├── profile/         # User profile
│   │   ├── projects/        # Projects page
│   │   ├── settings/        # Settings page
│   │   └── skills/          # Skills page
│   ├── services/
│   │   └── auth.service.ts  # Authentication service
│   ├── app.config.ts        # App configuration
│   ├── app.routes.ts        # Route definitions
│   └── app.ts               # Root component
├── environments/
│   ├── environment.ts           # Development config
│   └── environment.production.ts # Production config
└── styles.scss              # Global glassmorphism theme
```

## Prerequisites

- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)
- C# Backend running (my-portfolio-api)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Jayvee316/jayvee-dashboard-1.git
cd jayvee-dashboard-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Edit `src/environments/environment.ts` for local development:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5022/api',  // C# backend URL
  nodeApiUrl: 'http://localhost:3000/api' // Optional Node.js backend
};
```

For production, edit `src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.onrender.com/api',
  nodeApiUrl: 'https://your-node-api.onrender.com/api'
};
```

### 4. Start the C# Backend

Make sure the C# backend (my-portfolio-api) is running:

```bash
cd ../my-portfolio-api
dotnet run
```

The API should be available at `http://localhost:5022`.

### 5. Start the Angular App

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200`.

## Authentication Flow

### Login Process

1. User enters credentials on `/login` page
2. Angular sends POST to `/api/auth/login` on C# backend
3. Backend validates credentials and returns JWT token + user data
4. Token is stored in localStorage
5. User is redirected to `/dashboard`

### Token Management

- **Storage**: JWT token stored in `localStorage` as `auth_token`
- **Injection**: `auth.interceptor.ts` adds `Authorization: Bearer <token>` to API requests
- **Expiration**: Token expiry is checked before API calls and on app startup
- **Logout**: Clears token from localStorage and redirects to login

### Route Guards

| Guard | Purpose |
|-------|---------|
| `authGuard` | Protects routes requiring authentication |
| `guestGuard` | Prevents logged-in users from accessing login page |
| `adminGuard` | Restricts routes to admin users only |

### Test Credentials

```
Email: admin@example.com
Password: admin123
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run watch` | Build and watch for changes |

## Glassmorphism Theme

The app uses CSS custom properties for theming. Key variables in `styles.scss`:

```scss
:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(20px);
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}
```

### Glass Components

- `.glass-card` - Frosted glass card with hover effects
- `.glass-btn` - Glass-styled buttons (primary, secondary, ghost)
- `.glass-input` - Form inputs with glass styling

## Deployment

### Vercel (Recommended for Frontend)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/jayvee-dashboard-1`
4. Add environment variables if needed

### Manual Build

```bash
npm run build
```

The built files will be in `dist/jayvee-dashboard-1/`.

## Related Projects

- [my-portfolio-api](https://github.com/Jayvee316/my-portfolio-api) - C# ASP.NET Core backend with JWT authentication

## License

MIT

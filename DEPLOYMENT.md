# EcoDu Deployment Guide

## Overview
EcoDu is a fully functional educational platform with authentication, user profiles, comments, quizzes, and progress tracking.

## Project Structure

```
project/
├── index.html              # Main landing page
├── login.html             # Login page
├── register.html          # Registration page
├── profile.html           # User profile page
├── quiz.html              # Quiz page
├── *-ifloslanish.html     # Video lesson pages
├── style.css              # Main styles
├── watch-video.css        # Video page styles
├── profile.css            # Profile page styles
├── quiz.css               # Quiz page styles
├── register.css           # Auth pages styles
├── js/
│   ├── supabase.js        # Supabase client configuration
│   ├── auth-nav.js        # Navigation auth handler
│   ├── comments.js        # Comment system
│   ├── quiz.js            # Quiz functionality
│   └── profile.js         # Profile page logic
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── .env                   # Environment variables (not in repo)
```

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard:
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings > API
- Copy the Project URL and anon/public key

### 3. Database Setup

The database schema has already been applied via migrations. It includes:

- `profiles` - User profiles
- `lessons` - Video lessons
- `comments` - User comments on lessons
- `quizzes` - Quiz metadata
- `quiz_questions` - Quiz questions and answers
- `quiz_results` - User quiz attempts
- `user_progress` - Lesson completion tracking

All tables have Row Level Security (RLS) enabled with appropriate policies.

### 4. Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

3. Add environment variables in Netlify dashboard

### Option 3: Static Hosting (GitHub Pages, etc.)

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder contents to your hosting provider

3. Configure environment variables through your hosting provider's dashboard

## Features

### 1. Authentication
- Email/password registration and login
- Protected routes
- Profile management
- Automatic profile creation on signup

### 2. Video Lessons
- 5 environmental education videos
- Video player with YouTube embeds
- Lesson descriptions and metadata

### 3. Comments System
- Users can comment on lessons
- Edit and delete own comments
- Real-time comment loading
- User authentication required

### 4. Quiz System
- Interactive quizzes for each lesson
- Multiple choice questions
- Score tracking
- Results saved to user profile
- Progress visualization

### 5. User Profile
- View personal information
- See completed lessons count
- View quiz history and scores
- Track learning progress

## Security Features

- Row Level Security (RLS) on all database tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- Protected API routes
- Input validation

## Troubleshooting

### Issue: "Supabase URL or Anon Key is missing"
**Solution**: Ensure `.env` file exists with correct values

### Issue: Comments/Quizzes not loading
**Solution**: Check Supabase connection and RLS policies

### Issue: Login/Registration fails
**Solution**: Verify Supabase Auth is enabled in your project settings

### Issue: Build fails
**Solution**: Run `npm install` and ensure all dependencies are installed

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Check Supabase dashboard for API issues
4. Review RLS policies in Supabase

## Future Enhancements

Potential features to add:
- Social media login (Google, Facebook)
- Email verification
- Password reset functionality
- Advanced quiz types
- Lesson progress saving
- Certificates of completion
- Discussion forums
- Video upload functionality
- Admin dashboard

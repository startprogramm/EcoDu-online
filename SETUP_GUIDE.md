# EcoDu Complete Setup Guide

## What Has Been Built

Your EcoDu website now has a complete backend system with:

### 1. User Authentication System
- **Registration**: New users can create accounts with name, email, and password
- **Login**: Existing users can log in securely
- **Logout**: Users can log out from any page
- **Profile Management**: Automatic profile creation on signup

### 2. Database (Supabase)
The following tables have been created with proper security:

- **profiles**: User information (name, email, avatar)
- **lessons**: Video lesson metadata (title, description, video URL)
- **comments**: User comments on lessons
- **quizzes**: Quiz information for each lesson
- **quiz_questions**: Questions with multiple choice answers
- **quiz_results**: User quiz attempts and scores
- **user_progress**: Track completed lessons

### 3. Comments System
- Users can write comments on any video lesson
- Edit their own comments
- Delete their own comments
- View all comments from other users
- Automatically shows user name and timestamp

### 4. Quiz System
- Interactive multiple-choice quizzes for each lesson
- Progress bar showing current question
- Score calculation and feedback
- Results saved to user profile
- View quiz history in profile

### 5. User Profile Page
- Display user information
- Show statistics:
  - Lessons completed
  - Quizzes taken
  - Comments posted
- View recent quiz results with scores
- Member since date

## How to Set Up and Deploy

### Step 1: Get Supabase Credentials

1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project (or use the existing one where migrations were applied)
4. Wait for the project to finish setting up
5. Go to **Project Settings** > **API**
6. Copy these two values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key** (starts with "eyJ...")

### Step 2: Configure Your Project

1. In your project folder, create a file named `.env`
2. Add your credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with what you copied from Supabase.

### Step 3: Install and Run Locally

Open terminal in your project folder and run:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Your website will open at `http://localhost:3000`

### Step 4: Test Everything

1. **Test Registration**:
   - Go to register page
   - Create a new account
   - Should redirect to login page

2. **Test Login**:
   - Log in with your new account
   - Should redirect to home page
   - Navigation should now show "Profile" and "Logout"

3. **Test Profile**:
   - Click "Profile" in navigation
   - Should see your user info and stats

4. **Test Video Lessons**:
   - Go to any video lesson page
   - Watch the video
   - Scroll down to see comments section

5. **Test Comments**:
   - Write a comment on a lesson
   - Click "Post Comment"
   - Should see your comment appear
   - Try editing/deleting your comment

6. **Test Quizzes**:
   - On a lesson page, click "Take Quiz"
   - Answer the questions
   - Submit and see your results
   - Results should save to your profile

### Step 5: Deploy to Production

#### Option A: Deploy to Vercel (Recommended - Free)

1. Create account at https://vercel.com
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts
5. After deployment, go to your Vercel dashboard
6. Add environment variables:
   - Go to Project Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Redeploy

#### Option B: Deploy to Netlify (Also Free)

1. Create account at https://netlify.com
2. Build your project:
```bash
npm run build
```

3. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

4. Deploy:
```bash
netlify deploy --prod --dir=dist
```

5. Add environment variables in Netlify dashboard
6. Trigger a redeploy

## File Structure Explained

```
project/
├── index.html              # Home page with lessons list
├── login.html             # Login page
├── register.html          # Registration page
├── profile.html           # User profile page
├── quiz.html              # Quiz taking page
│
├── Video Lesson Pages:
├── plastik-ifloslanish.html      # Plastic pollution lesson
├── o'rmonlar-kesilishi.html      # Deforestation lesson
├── havo-ifloslanishi.html        # Air pollution lesson
├── suv-ifloslanishi.html         # Water pollution lesson
├── yovvyi-tabiat.html            # Wildlife lesson
│
├── CSS Files:
├── style.css              # Main site styles
├── register.css           # Auth pages styles
├── profile.css            # Profile page styles
├── quiz.css               # Quiz page styles
├── watch-video.css        # Video lesson pages styles
│
├── JavaScript Files:
├── js/
│   ├── supabase.js        # Database connection
│   ├── auth-nav.js        # Navigation updates
│   ├── comments.js        # Comment system
│   ├── quiz.js            # Quiz functionality
│   └── profile.js         # Profile page logic
│
├── Configuration:
├── package.json           # Dependencies
├── vite.config.js         # Build configuration
├── .env                   # Your credentials (don't commit!)
├── .env.example           # Example env file
│
└── Documentation:
    ├── README.md              # Quick start guide
    ├── DEPLOYMENT.md          # Detailed deployment guide
    └── SETUP_GUIDE.md         # This file
```

## Important Security Notes

1. **Never commit `.env` file to Git**
   - It contains your secret credentials
   - Already added to `.gitignore`

2. **Row Level Security (RLS) is enabled**
   - Users can only see/edit their own data
   - All database tables are protected

3. **Authentication is required for**:
   - Writing comments
   - Taking quizzes
   - Viewing profile
   - Viewing quiz results

## How Each Feature Works

### Authentication Flow
1. User registers → Creates entry in Supabase Auth
2. Trigger automatically creates profile in `profiles` table
3. User logs in → Session token stored
4. Token used to authenticate all requests

### Comments Flow
1. User types comment → Clicks submit
2. System checks if user is logged in
3. Creates comment in `comments` table
4. Links comment to user ID and lesson ID
5. Comments reload and display

### Quiz Flow
1. User clicks "Take Quiz" on lesson
2. System loads quiz questions from database
3. User answers questions one by one
4. System calculates score
5. Saves result to `quiz_results` table
6. Shows final score and feedback

### Profile Flow
1. User clicks "Profile" in navigation
2. System loads user data from `profiles`
3. Counts completed lessons from `user_progress`
4. Counts quizzes from `quiz_results`
5. Counts comments from `comments`
6. Displays recent quiz history

## Troubleshooting

### "Supabase URL or Anon Key is missing"
- Check that `.env` file exists
- Check that values are correct
- Restart dev server after creating `.env`

### Login/Register doesn't work
- Check Supabase dashboard for errors
- Verify Email Auth is enabled in Supabase
- Check browser console for error messages

### Comments not showing
- Make sure you're logged in
- Check that RLS policies are active in Supabase
- Verify lesson exists in database

### Quiz not loading
- Check that lesson slug matches in URL
- Verify quiz questions exist for that lesson
- Check browser console for errors

## Next Steps

### Immediate Tasks:
1. Create `.env` file with your Supabase credentials
2. Run `npm install` to install dependencies
3. Run `npm run dev` to test locally
4. Register a test account and try all features
5. Deploy to Vercel or Netlify

### Optional Enhancements:
- Add more quiz questions for each lesson
- Add email verification
- Add password reset functionality
- Add more video lessons
- Add lesson categories/tags
- Add search functionality
- Add user avatars upload
- Add social sharing features

## Need Help?

1. Check browser console for error messages
2. Check Supabase dashboard logs
3. Review the error message carefully
4. Verify all environment variables are set
5. Make sure you're using the correct Supabase project

## Success Checklist

- [ ] Supabase project created and migrations applied
- [ ] `.env` file created with correct credentials
- [ ] Dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] Can register a new account
- [ ] Can log in
- [ ] Can view profile
- [ ] Can post a comment
- [ ] Can take a quiz
- [ ] Build succeeds (`npm run build`)
- [ ] Deployed to hosting platform
- [ ] Environment variables set in hosting platform
- [ ] Production site works correctly

Once all checkboxes are complete, your EcoDu platform is fully operational!

/*
  # EcoDu Initial Database Schema

  ## Overview
  Complete database schema for EcoDu educational platform with user management,
  comments, quizzes, and progress tracking.

  ## New Tables

  ### 1. `profiles`
  - `id` (uuid, references auth.users)
  - `name` (text)
  - `email` (text)
  - `avatar_url` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `lessons`
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text, unique)
  - `description` (text)
  - `video_url` (text)
  - `thumbnail_url` (text)
  - `category` (text)
  - `created_at` (timestamptz)
  
  ### 3. `comments`
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, references lessons)
  - `user_id` (uuid, references profiles)
  - `content` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. `quizzes`
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, references lessons)
  - `title` (text)
  - `description` (text)
  - `created_at` (timestamptz)
  
  ### 5. `quiz_questions`
  - `id` (uuid, primary key)
  - `quiz_id` (uuid, references quizzes)
  - `question_text` (text)
  - `options` (jsonb, array of options)
  - `correct_answer` (integer, index of correct option)
  - `order_num` (integer)
  
  ### 6. `quiz_results`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `quiz_id` (uuid, references quizzes)
  - `score` (integer)
  - `total_questions` (integer)
  - `answers` (jsonb)
  - `completed_at` (timestamptz)
  
  ### 7. `user_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `lesson_id` (uuid, references lessons)
  - `completed` (boolean)
  - `completed_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can read their own data
  - Users can create/update/delete their own content
  - Public read access for lessons and quizzes
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO public
  USING (true);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  TO public
  USING (true);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  order_num integer NOT NULL DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO public
  USING (true);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_lesson_id ON comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Insert initial lessons data
INSERT INTO lessons (title, slug, description, video_url, thumbnail_url, category) VALUES
  ('Plastik ifloslanish', 'plastik-ifloslanish', 'Plastik nega xavfli? U tabiatni qanday ifloslantiradi va biz uni kamaytirish uchun nimalar qilishimiz mumkinligi haqida bilib oling!', 'https://www.youtube.com/embed/X7fd43sDWLw?si=OAB6FAmHA0KDZhTb', 'plastik.jpg', 'pollution'),
  ('O''rmonlar yo''qolishi', 'o''rmonlar-kesilishi', 'Daraxtlar nima uchun kesiladi va bu tabiatga qanday zarar keltiradi? O''rmonlarning yo''qolishi va uni to''xtatish yo''llari haqida bilib oling!', 'https://www.youtube.com/embed/GDFZ5qK-j1s?si=P1XP4G2uO8Mu5EMH', 'o''rmonlar.jpg', 'deforestation'),
  ('Havo ifloslanishi', 'havo-ifloslanishi', 'Havo nega ifloslanadi? Tutun, chang va gazlarning insonlar, hayvonlar va o''simliklarga qanday ta''sir o''tkazishini bilib oling!', 'https://www.youtube.com/embed/-jhLhu9Xt7Q?si=qzE06WvdLMEUAfHg', 'havo.jpg', 'pollution'),
  ('Suv ifloslanishi', 'suv-ifloslanishi', 'Suv nima uchun ifloslanadi? Bu hayvonlar va odamlarning hayotiga qanday ta''sir qiladi va uni qanday bartaraf etish mumkinligi haqida bilib oling!', 'https://www.youtube.com/embed/NAtU1bR1Wtk?si=pCHnBOJtoqtPMDIm', 'suv.png', 'pollution'),
  ('Yovvoyi tabiat', 'yovvyi-tabiat', 'Yovvoyi tabiatni asrash nimaga muhim? Hayvonlar, o''simliklar va ekotizimlarni saqlash yo''llari bilan tanishing!', 'https://www.youtube.com/embed/MzzWdmI27zk?si=Ci_3Dj2eHiqKH4JA', 'yovvoyitabiat.jpg', 'wildlife')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample quizzes
INSERT INTO quizzes (lesson_id, title, description)
SELECT id, title || ' - Test', 'Bu darsdan o''rgangan bilimlaringizni sinab ko''ring!'
FROM lessons
ON CONFLICT DO NOTHING;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
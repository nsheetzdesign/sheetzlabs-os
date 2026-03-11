-- Migration: 030_education.sql

-- Learning paths (courses)
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Path info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,                          -- Lucide icon name
  color TEXT DEFAULT '#10b981',       -- Accent color

  -- Structure
  estimated_hours INTEGER,
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced

  -- Status
  is_published BOOLEAN DEFAULT false,
  is_ai_generated BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules within a path
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,

  -- Module info
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,

  -- Content
  estimated_minutes INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons within a module
CREATE TABLE IF NOT EXISTS learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,

  -- Lesson info
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,

  -- Content (markdown)
  content TEXT,

  -- AI generation
  is_ai_generated BOOLEAN DEFAULT false,
  generation_prompt TEXT,             -- Prompt used to generate

  -- Timing
  estimated_minutes INTEGER DEFAULT 10,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(learning_module_id, slug)
);

-- Exercises/quizzes
CREATE TABLE IF NOT EXISTS learning_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_lesson_id UUID REFERENCES learning_lessons(id) ON DELETE CASCADE,

  -- Exercise info
  title TEXT NOT NULL,
  type TEXT DEFAULT 'code',           -- code, quiz, project
  sort_order INTEGER DEFAULT 0,

  -- Content
  instructions TEXT,
  starter_code TEXT,
  solution_code TEXT,
  hints JSONB DEFAULT '[]',

  -- Validation
  test_cases JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- What was completed
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  learning_module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  learning_lesson_id UUID REFERENCES learning_lessons(id) ON DELETE CASCADE,
  learning_exercise_id UUID REFERENCES learning_exercises(id) ON DELETE CASCADE,

  -- Progress
  status TEXT DEFAULT 'not_started',  -- not_started, in_progress, completed
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,

  -- Exercise results
  attempts INTEGER DEFAULT 0,
  best_score INTEGER,
  last_submission TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, learning_lesson_id)
);

-- Q&A conversations
CREATE TABLE IF NOT EXISTS learning_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,

  title TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES learning_conversations(id) ON DELETE CASCADE,

  role TEXT NOT NULL,                 -- user, assistant
  content TEXT NOT NULL,

  -- Context used
  context_files JSONB DEFAULT '[]',   -- Files from codebase referenced
  context_lessons JSONB DEFAULT '[]', -- Lessons referenced

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_learning_modules_path ON learning_modules(learning_path_id);
CREATE INDEX idx_learning_lessons_module ON learning_lessons(learning_module_id);
CREATE INDEX idx_learning_exercises_lesson ON learning_exercises(learning_lesson_id);
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_lesson ON learning_progress(learning_lesson_id);
CREATE INDEX idx_learning_messages_conversation ON learning_messages(conversation_id);

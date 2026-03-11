-- Migration: 031_education_seeds.sql

-- TypeScript Mastery
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('TypeScript Mastery', 'typescript', 'Deep dive into TypeScript — from basics to advanced patterns used in production.', 'FileCode', '#3178c6', 20, 'intermediate');

-- React + React Router
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('React + React Router v7', 'react', 'Modern React patterns with React Router v7 — loaders, actions, and data flow.', 'Atom', '#61dafb', 25, 'intermediate');

-- Angular
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('Angular Fundamentals', 'angular', 'Complete Angular — components, services, RxJS, and enterprise patterns.', 'Shield', '#dd0031', 30, 'intermediate');

-- AWS
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('AWS Solutions Architect', 'aws', 'Prepare for AWS SAA certification — EC2, S3, VPC, Lambda, and architecture.', 'Cloud', '#ff9900', 40, 'advanced');

-- Supabase + PostgreSQL
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('Supabase + PostgreSQL', 'supabase', 'Master Supabase — schema design, RLS, auth, edge functions, and migrations.', 'Database', '#3ecf8e', 15, 'beginner');

-- Cloudflare Workers
INSERT INTO learning_paths (title, slug, description, icon, color, estimated_hours, difficulty) VALUES
('Cloudflare Workers', 'cloudflare', 'Build on the edge — Workers, KV, D1, Hono, and serverless patterns.', 'Globe', '#f38020', 12, 'intermediate');

-- Mark all as published
UPDATE learning_paths SET is_published = true;

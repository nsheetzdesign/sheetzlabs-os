-- Migration: 034_learning_structure.sql
-- Seed modules and lessons for all learning paths

-- ============================================================
-- TypeScript Mastery
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'TypeScript Fundamentals', 'Core type system and basic patterns', 0, 120
FROM learning_paths WHERE slug = 'typescript';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Advanced Types', 'Generics, conditionals, and mapped types', 1, 180
FROM learning_paths WHERE slug = 'typescript';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'TypeScript in Practice', 'Real-world patterns and best practices', 2, 150
FROM learning_paths WHERE slug = 'typescript';

-- TypeScript Lessons (Module 1: Fundamentals)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Why TypeScript?', 'why-typescript', 0, 10
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Basic Types', 'basic-types', 1, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Type Inference', 'type-inference', 2, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Interfaces vs Types', 'interfaces-vs-types', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Functions and Typing', 'functions-typing', 4, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 0;

-- TypeScript Lessons (Module 2: Advanced Types)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Generics Basics', 'generics-basics', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Generic Constraints', 'generic-constraints', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Conditional Types', 'conditional-types', 2, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Mapped Types', 'mapped-types', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Utility Types Deep Dive', 'utility-types', 4, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 1;

-- TypeScript Lessons (Module 3: In Practice)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Strict Mode and Config', 'strict-mode', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Type Guards and Narrowing', 'type-guards', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Error Handling Patterns', 'error-handling', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Working with APIs', 'api-types', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'typescript' AND m.sort_order = 2;

-- ============================================================
-- React + React Router v7
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'React Fundamentals', 'Components, JSX, and basic patterns', 0, 120
FROM learning_paths WHERE slug = 'react';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Hooks Deep Dive', 'useState, useEffect, and custom hooks', 1, 150
FROM learning_paths WHERE slug = 'react';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'React Router v7', 'Loaders, actions, and data flow', 2, 180
FROM learning_paths WHERE slug = 'react';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Advanced Patterns', 'Performance, composition, and architecture', 3, 150
FROM learning_paths WHERE slug = 'react';

-- React Lessons (Module 1: Fundamentals)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Components and JSX', 'components-jsx', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Props and Children', 'props-children', 1, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Conditional Rendering', 'conditional-rendering', 2, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Lists and Keys', 'lists-keys', 3, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Event Handling', 'event-handling', 4, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 0;

-- React Lessons (Module 2: Hooks)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'useState Fundamentals', 'usestate', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'useEffect and Side Effects', 'useeffect', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'useRef and DOM Access', 'useref', 2, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'useMemo and useCallback', 'memo-callback', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Custom Hooks', 'custom-hooks', 4, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 1;

-- React Lessons (Module 3: React Router v7)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Routing Fundamentals', 'routing-basics', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Loaders and Data Fetching', 'loaders', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Actions and Mutations', 'actions', 2, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Nested Routes and Outlets', 'nested-routes', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'useFetcher and Optimistic UI', 'usefetcher', 4, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 2;

-- React Lessons (Module 4: Advanced)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Component Composition', 'composition', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Performance Optimization', 'performance', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Error Boundaries', 'error-boundaries', 2, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Testing React Components', 'testing', 3, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'react' AND m.sort_order = 3;

-- ============================================================
-- Angular Fundamentals
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Angular Basics', 'Components, templates, and the Angular CLI', 0, 120
FROM learning_paths WHERE slug = 'angular';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Services and DI', 'Dependency injection and services', 1, 120
FROM learning_paths WHERE slug = 'angular';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'RxJS Essentials', 'Observables, operators, and async patterns', 2, 180
FROM learning_paths WHERE slug = 'angular';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Routing and Navigation', 'Angular Router, guards, and resolvers', 3, 120
FROM learning_paths WHERE slug = 'angular';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Forms', 'Template-driven and reactive forms', 4, 150
FROM learning_paths WHERE slug = 'angular';

-- Angular Lessons (Module 1: Basics)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Angular CLI and Project Structure', 'cli-setup', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Components and Templates', 'components', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Data Binding', 'data-binding', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Directives', 'directives', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Pipes', 'pipes', 4, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 0;

-- Angular Lessons (Module 2: Services and DI)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Services Basics', 'services-basics', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Dependency Injection Deep Dive', 'di-deep-dive', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'HttpClient', 'httpclient', 2, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Interceptors', 'interceptors', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 1;

-- Angular Lessons (Module 3: RxJS)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Observables Fundamentals', 'observables', 0, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Subjects and BehaviorSubject', 'subjects', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Common Operators', 'operators', 2, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Higher-Order Observables', 'higher-order', 3, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Error Handling in RxJS', 'rxjs-errors', 4, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 2;

-- Angular Lessons (Module 4: Routing)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Router Setup', 'router-setup', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Route Parameters', 'route-params', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Guards', 'guards', 2, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Resolvers', 'resolvers', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Lazy Loading', 'lazy-loading', 4, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 3;

-- Angular Lessons (Module 5: Forms)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Template-Driven Forms', 'template-forms', 0, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 4;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Reactive Forms', 'reactive-forms', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 4;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Form Validation', 'validation', 2, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 4;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Dynamic Forms', 'dynamic-forms', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'angular' AND m.sort_order = 4;

-- ============================================================
-- Supabase + PostgreSQL
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Supabase Basics', 'Project setup, tables, and the dashboard', 0, 90
FROM learning_paths WHERE slug = 'supabase';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Row Level Security', 'Policies and secure data access', 1, 120
FROM learning_paths WHERE slug = 'supabase';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Authentication', 'Auth providers and session management', 2, 90
FROM learning_paths WHERE slug = 'supabase';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Advanced PostgreSQL', 'Functions, triggers, and migrations', 3, 150
FROM learning_paths WHERE slug = 'supabase';

-- Supabase Lessons (Module 1: Basics)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Project Setup', 'project-setup', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Creating Tables', 'creating-tables', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'CRUD Operations', 'crud', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Relationships and Joins', 'relationships', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 0;

-- Supabase Lessons (Module 2: RLS)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'What is RLS?', 'rls-intro', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Writing Policies', 'rls-policies', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Service Role vs Anon Key', 'service-vs-anon', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 1;

-- Supabase Lessons (Module 3: Auth)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Auth Overview', 'auth-overview', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Email and Password Auth', 'email-auth', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'OAuth Providers', 'oauth', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 2;

-- Supabase Lessons (Module 4: Advanced PostgreSQL)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Database Functions', 'db-functions', 0, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Triggers and Automation', 'triggers', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Migrations with Supabase CLI', 'migrations', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'supabase' AND m.sort_order = 3;

-- ============================================================
-- Cloudflare Workers
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Workers Fundamentals', 'Your first worker and the runtime', 0, 90
FROM learning_paths WHERE slug = 'cloudflare';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Hono Framework', 'Building APIs with Hono', 1, 120
FROM learning_paths WHERE slug = 'cloudflare';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Storage Options', 'KV, D1, R2, and Durable Objects', 2, 150
FROM learning_paths WHERE slug = 'cloudflare';

-- Cloudflare Lessons (Module 1: Fundamentals)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Your First Worker', 'first-worker', 0, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'The Workers Runtime', 'runtime', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Wrangler CLI', 'wrangler', 2, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Environment and Secrets', 'env-secrets', 3, 15
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 0;

-- Cloudflare Lessons (Module 2: Hono)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Hono Basics', 'hono-basics', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Middleware', 'middleware', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Request and Response', 'request-response', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Validation with Zod', 'zod-validation', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 1;

-- Cloudflare Lessons (Module 3: Storage)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Workers KV', 'workers-kv', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'D1 Database', 'd1', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'R2 Object Storage', 'r2', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Durable Objects', 'durable-objects', 3, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'cloudflare' AND m.sort_order = 2;

-- ============================================================
-- AWS Solutions Architect
-- ============================================================

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'AWS Fundamentals', 'Core services and the console', 0, 120
FROM learning_paths WHERE slug = 'aws';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Compute', 'EC2, Lambda, and containers', 1, 180
FROM learning_paths WHERE slug = 'aws';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Storage', 'S3, EBS, and storage classes', 2, 120
FROM learning_paths WHERE slug = 'aws';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Networking', 'VPC, subnets, and security groups', 3, 150
FROM learning_paths WHERE slug = 'aws';

INSERT INTO learning_modules (learning_path_id, title, description, sort_order, estimated_minutes)
SELECT id, 'Databases', 'RDS, DynamoDB, and ElastiCache', 4, 150
FROM learning_paths WHERE slug = 'aws';

-- AWS Lessons (Module 1: Fundamentals)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'AWS Global Infrastructure', 'global-infra', 0, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'IAM Fundamentals', 'iam', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'AWS CLI and SDKs', 'cli-sdk', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 0;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Cost Management', 'cost-management', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 0;

-- AWS Lessons (Module 2: Compute)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'EC2 Instances', 'ec2', 0, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Lambda Functions', 'lambda', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'ECS and Fargate', 'ecs-fargate', 2, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 1;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Auto Scaling', 'auto-scaling', 3, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 1;

-- AWS Lessons (Module 3: Storage)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'S3 Fundamentals', 's3', 0, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'S3 Storage Classes', 's3-storage-classes', 1, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 2;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'EBS and EFS', 'ebs-efs', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 2;

-- AWS Lessons (Module 4: Networking)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'VPC Deep Dive', 'vpc', 0, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Security Groups and NACLs', 'security-groups', 1, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Load Balancing', 'load-balancing', 2, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 3;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'Route 53', 'route53', 3, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 3;

-- AWS Lessons (Module 5: Databases)
INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'RDS Overview', 'rds', 0, 25
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 4;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'DynamoDB Fundamentals', 'dynamodb', 1, 30
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 4;

INSERT INTO learning_lessons (learning_module_id, title, slug, sort_order, estimated_minutes)
SELECT m.id, 'ElastiCache', 'elasticache', 2, 20
FROM learning_modules m JOIN learning_paths p ON m.learning_path_id = p.id
WHERE p.slug = 'aws' AND m.sort_order = 4;

-- Migration: 032_education_agents.sql

-- Add 'education' to the department enum
ALTER TYPE department ADD VALUE IF NOT EXISTS 'education';

-- =============================================
-- StepChef — Supabase Database Setup
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/essewyjnpbaixpagrmal/sql/new
-- =============================================

-- 1. Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Uncategorized',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Steps table (linked to recipes)
CREATE TABLE IF NOT EXISTS steps (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  ingredients TEXT NOT NULL DEFAULT '',
  scale       TEXT NOT NULL DEFAULT 'tablespoon',
  quantity    NUMERIC NOT NULL DEFAULT 1,
  start_time  TIMESTAMP WITH TIME ZONE,
  end_time    TIMESTAMP WITH TIME ZONE,
  duration    NUMERIC NOT NULL DEFAULT 0,   -- in minutes
  step_order  INTEGER NOT NULL DEFAULT 0
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- 4. Enable Row Level Security (RLS) — allow public access via anon key
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (anon key)
CREATE POLICY "Allow all for anon" ON recipes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON steps FOR ALL TO anon USING (true) WITH CHECK (true);

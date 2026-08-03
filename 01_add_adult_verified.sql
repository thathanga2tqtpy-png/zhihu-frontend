-- Run this query in the Supabase SQL Editor to add the is_adult_verified column
ALTER TABLE public.users
ADD COLUMN is_adult_verified boolean DEFAULT false;

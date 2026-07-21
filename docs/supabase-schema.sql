-- Run this in the Supabase SQL editor when the project is ready.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  time text,
  serves integer not null default 1 check (serves > 0),
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create index recipes_user_id_idx on public.recipes(user_id);
create index categories_user_id_idx on public.categories(user_id);
create index favorites_user_id_idx on public.favorites(user_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;

create policy "Users manage their profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage their categories" on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their recipes" on public.recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a private `recipe-images` Storage bucket in the Supabase dashboard.
-- Add Storage policies that restrict object access to a folder named with auth.uid().

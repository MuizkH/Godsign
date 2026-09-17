-- 002_create_tables.sql

-- 1. Services Table
create table if not exists public.services (
  id text primary key,
  department_id text not null,
  category text not null,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- 2. Vocabularies Table
create table if not exists public.vocabularies (
  id text primary key,
  service_id text references public.services(id) on delete cascade,
  word text not null,
  sign_key text,
  media_type text default 'video',
  media_url text,
  instruction_text text,
  created_at timestamptz default now()
);

-- 3. Feedback Table
create table if not exists public.feedback (
  id text primary key,
  rating integer not null check (rating >= 1 and rating <= 5),
  comments text,
  kiosk_id text,
  department text,
  created_at timestamptz default now()
);

-- 4. Lessons Table
create table if not exists public.lessons (
  id integer primary key,
  name text not null,
  sign text not null,
  instruction text
);

-- 5. Staff Roster Table
create table if not exists public.staff_roster (
  id serial primary key,
  name text not null,
  role text not null,
  lessons text default '0/30',
  last_active text default 'Never',
  status text default 'not_started'
);

-- Row Level Security & Access Policies
alter table public.services enable row level security;
alter table public.vocabularies enable row level security;
alter table public.feedback enable row level security;
alter table public.lessons enable row level security;
alter table public.staff_roster enable row level security;

create policy "Allow public read access to services" on public.services for select using (true);
create policy "Allow public read access to vocabularies" on public.vocabularies for select using (true);
create policy "Allow public insert and read access to feedback" on public.feedback for select using (true);
create policy "Allow public insert to feedback" on public.feedback for insert with check (true);
create policy "Allow public read access to lessons" on public.lessons for select using (true);
create policy "Allow public read access to staff_roster" on public.staff_roster for select using (true);

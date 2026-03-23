-- Create coach_messages table
create table if not exists coach_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null,
  content text not null,
  created_at timestamp default now()
);

-- Create coach_commitments table
create table if not exists coach_commitments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  commitment text not null,
  due_date text,
  completed boolean default false,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table coach_messages enable row level security;
alter table coach_commitments enable row level security;

-- Create RLS Policies
create policy "Users see own messages" on coach_messages
  for all using (auth.uid() = user_id);

create policy "Users see own commitments" on coach_commitments
  for all using (auth.uid() = user_id);

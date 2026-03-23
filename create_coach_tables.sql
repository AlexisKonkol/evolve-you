create table if not exists coach_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null,
  content text not null,
  created_at timestamp default now()
);

create table if not exists coach_commitments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  commitment text not null,
  due_date text,
  completed boolean default false,
  created_at timestamp default now()
);

alter table profiles 
add column if not exists navigation_style text;

alter table coach_messages enable row level security;
alter table coach_commitments enable row level security;

create policy "Users own messages" on coach_messages
  for all using (auth.uid() = user_id);
  
create policy "Users own commitments" on coach_commitments
  for all using (auth.uid() = user_id);

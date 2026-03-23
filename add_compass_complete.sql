alter table profiles 
add column if not exists compass_complete 
boolean default false;

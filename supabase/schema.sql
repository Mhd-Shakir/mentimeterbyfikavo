create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.presentations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null default 'Untitled Fikavo deck',
  room_code text not null unique,
  is_live boolean not null default false,
  current_slide_index integer not null default -1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_code_format check (room_code ~ '^[0-9]{6}$')
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  presentation_id uuid not null references public.presentations(id) on delete cascade,
  question_text text not null,
  time_limit integer not null default 20,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  room_code text not null,
  user_nickname text not null,
  question_id uuid not null references public.questions(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade,
  points_earned integer not null default 0,
  time_taken integer not null default 0,
  created_at timestamptz not null default now(),
  unique (room_code, user_nickname, question_id)
);

create index if not exists presentations_room_code_idx on public.presentations(room_code);
create index if not exists questions_presentation_order_idx on public.questions(presentation_id, order_index);
create index if not exists responses_room_question_idx on public.responses(room_code, question_id);

alter table public.profiles enable row level security;
alter table public.presentations enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.responses enable row level security;

create policy "profiles are self readable" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles are self writable" on public.profiles
  for insert with check (auth.uid() = id);

create policy "presenters manage own decks" on public.presentations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "live decks are joinable" on public.presentations
  for select using (is_live = true or auth.uid() = user_id);

create policy "presenters manage own questions" on public.questions
  for all using (
    exists (
      select 1 from public.presentations p
      where p.id = questions.presentation_id and p.user_id = auth.uid()
    )
  );

create policy "participants read live questions" on public.questions
  for select using (
    exists (
      select 1 from public.presentations p
      where p.id = questions.presentation_id and p.is_live = true
    )
  );

create policy "presenters manage own options" on public.options
  for all using (
    exists (
      select 1 from public.questions q
      join public.presentations p on p.id = q.presentation_id
      where q.id = options.question_id and p.user_id = auth.uid()
    )
  );

create policy "participants read live options" on public.options
  for select using (
    exists (
      select 1 from public.questions q
      join public.presentations p on p.id = q.presentation_id
      where q.id = options.question_id and p.is_live = true
    )
  );

create policy "participants insert responses" on public.responses
  for insert with check (
    exists (
      select 1 from public.presentations p
      join public.questions q on q.presentation_id = p.id
      where p.room_code = responses.room_code
        and p.is_live = true
        and q.id = responses.question_id
    )
  );

create policy "presenters read room responses" on public.responses
  for select using (
    exists (
      select 1 from public.presentations p
      where p.room_code = responses.room_code and p.user_id = auth.uid()
    )
  );

alter publication supabase_realtime add table public.presentations;
alter publication supabase_realtime add table public.responses;

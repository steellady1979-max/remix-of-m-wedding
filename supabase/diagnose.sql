-- Read-only: run in the confirmed active project's SQL editor.
-- Inspect definitions only; no guest rows, credentials or writes.
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('rsvps', 'wishes')
order by table_name, ordinal_position;

select c.relname as table_name, c.relrowsecurity as rls_enabled,
       con.conname, pg_get_constraintdef(con.oid) as constraint_definition
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_constraint con on con.conrelid = c.oid
where n.nspname = 'public' and c.relname in ('rsvps', 'wishes');

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('rsvps', 'wishes');

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('rsvps', 'wishes')
  and grantee in ('anon', 'authenticated');

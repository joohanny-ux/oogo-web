drop policy if exists "admins and editors can upload oogo assets" on storage.objects;
drop policy if exists "admins and editors can update oogo assets" on storage.objects;
drop policy if exists "admins and editors can delete oogo assets" on storage.objects;

create policy "admins and editors can upload oogo assets" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'oogo-assets'
    and public.can_manage_content()
  );

create policy "admins and editors can update oogo assets" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'oogo-assets'
    and public.can_manage_content()
  )
  with check (
    bucket_id = 'oogo-assets'
    and public.can_manage_content()
  );

create policy "admins and editors can delete oogo assets" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'oogo-assets'
    and public.can_manage_content()
  );

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;

create trigger products_touch_updated_at
before update on public.products
for each row
execute function public.touch_updated_at();

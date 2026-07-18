alter table public.product_translations
  add column if not exists frame_size text;

update public.product_translations as translations
set
  frame_size = coalesce(nullif(trim(translations.frame_size), ''), products.size),
  colorway = coalesce(nullif(trim(translations.colorway), ''), products.reference_color_name)
from public.products as products
where translations.product_id = products.id;

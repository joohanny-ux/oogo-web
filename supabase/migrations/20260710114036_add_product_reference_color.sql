alter table public.products
  add column if not exists reference_color_name text;

update public.products as products
set reference_color_name = translations.colorway
from public.product_translations as translations
where translations.product_id = products.id
  and translations.locale = 'ko'
  and products.reference_color_name is null
  and nullif(trim(translations.colorway), '') is not null;

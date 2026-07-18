alter table public.product_translations
  add column if not exists size_note text,
  add column if not exists frame_material text,
  add column if not exists lens_material text,
  add column if not exists lens_features text[] not null default '{}';

update public.product_translations as translations
set
  frame_material = coalesce(translations.frame_material, products.frame_material),
  lens_material = coalesce(translations.lens_material, products.lens_material),
  lens_features = case
    when cardinality(translations.lens_features) = 0 then coalesce(products.lens_features, '{}')
    else translations.lens_features
  end
from public.products as products
where translations.product_id = products.id;

create unique index if not exists product_images_product_id_role_unique
  on public.product_images(product_id, role);

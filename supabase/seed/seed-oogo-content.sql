insert into public.landing_pages (page_key, title, published, sort_order) values
  ('header', 'Header', true, 10),
  ('home', 'Home', true, 20),
  ('brand-story', 'Brand Story', true, 30),
  ('collection', 'Collection', true, 40),
  ('projects', 'Projects', true, 50),
  ('product-detail', 'Product Detail', true, 60),
  ('special-edition', 'Special Edition', true, 70),
  ('archive', 'Archive', true, 80),
  ('inquiry', 'Inquiry', true, 90),
  ('footer', 'Footer', true, 100)
on conflict (page_key) do update set
  title = excluded.title,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.company_settings (id, email, phone, kakao, instagram, facebook, tiktok, address)
values (
  true,
  'contact@oogolabs.com',
  null,
  null,
  'https://www.instagram.com/oogolabs',
  'https://www.facebook.com/oogolabs',
  'https://www.tiktok.com/@oogolabs',
  'Seoul, Korea'
)
on conflict (id) do update set
  email = excluded.email,
  instagram = excluded.instagram,
  facebook = excluded.facebook,
  tiktok = excluded.tiktok,
  address = excluded.address;

insert into public.company_translations (locale, brand_description, footer_note) values
  ('ko', 'OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다.', 'OOGO frames a way of seeing.'),
  ('en', 'OOGO is a Korean eyewear brand for quiet confidence and a refined way of seeing.', 'OOGO frames a way of seeing.'),
  ('zh', 'OOGO 是一个以安静自信与精致视角为核心的韩国眼镜品牌。', 'OOGO frames a way of seeing.')
on conflict (locale) do update set
  brand_description = excluded.brand_description,
  footer_note = excluded.footer_note;

insert into public.special_editions (slug, collaborator, year, theme, published, featured, sort_order)
values (
  'youngbin-edition-2026',
  'Youngbin',
  '2026',
  'Photography, light, and quiet attitude',
  true,
  true,
  10
)
on conflict (slug) do update set
  collaborator = excluded.collaborator,
  year = excluded.year,
  theme = excluded.theme,
  published = excluded.published,
  featured = excluded.featured,
  sort_order = excluded.sort_order;

insert into public.special_edition_translations (special_edition_id, locale, title, summary, story, cta, tags)
select
  special_editions.id,
  seed_values.locale,
  seed_values.title,
  seed_values.summary,
  seed_values.story,
  seed_values.cta,
  seed_values.tags
from public.special_editions
cross join (
  values
    (
      'ko',
      'Youngbin Edition',
      '빛을 기록하는 사진가의 시선과 OOGO의 조용한 프레임 언어가 만나는 첫 스페셜 에디션.',
      'Youngbin Edition은 빛의 방향, 얼굴 위의 그림자, 그리고 일상 속 태도를 하나의 캠페인으로 엮습니다.',
      'Request special edition catalog',
      array['Photography', 'Limited color', 'Buyer catalog']::text[]
    ),
    (
      'en',
      'Youngbin Edition',
      'OOGO meets a photographer’s way of recording light in its first special edition.',
      'Youngbin Edition connects light direction, facial shadow, and everyday attitude through a campaign archive.',
      'Request special edition catalog',
      array['Photography', 'Limited color', 'Buyer catalog']::text[]
    ),
    (
      'zh',
      'Youngbin Edition',
      'OOGO 首个特别版，将摄影师记录光线的视角与安静的镜框语言相结合。',
      'Youngbin Edition 以光线方向、脸部阴影与日常态度构成一组视觉档案。',
      'Request special edition catalog',
      array['Photography', 'Limited color', 'Buyer catalog']::text[]
    )
) as seed_values(locale, title, summary, story, cta, tags)
where special_editions.slug = 'youngbin-edition-2026'
on conflict (special_edition_id, locale) do update set
  title = excluded.title,
  summary = excluded.summary,
  story = excluded.story,
  cta = excluded.cta,
  tags = excluded.tags;

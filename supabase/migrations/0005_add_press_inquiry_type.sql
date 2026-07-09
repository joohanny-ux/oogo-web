-- press 문의 유형을 inquiries.type check constraint에 추가한다.

alter table public.inquiries
  drop constraint if exists inquiries_type_check;

alter table public.inquiries
  add constraint inquiries_type_check
  check (type in ('general', 'buyer', 'retail', 'collaboration', 'other', 'press'));

# OOGO Managed Brand Site Design

Date: 2026-06-30

## Goal

Build the official OOGO brand homepage for `www.oogolaps.com` as a managed brand site.

The public site should establish trust in OOGO as a premium Korean eyewear brand. It should feel quiet, balanced, image-led, and refined. The admin dashboard should let the owner update products, images, landing-page copy, translations, company information, and inquiries without editing code.

## Source Materials

- `00 OOGO_BrandBook_2026_v3.0.pdf`
- `00 OOGO_Catalog_2026_v2.0.pdf`
- `00 OOGO_SpecialEdition_2026_v1.0.pdf`
- Brand image folder: `G:\다른 컴퓨터\내 PC\Google Sharing\ZOVA\OOGO\Documents\Brandbook images`
- Catalog image folder: `G:\다른 컴퓨터\내 PC\Google Sharing\ZOVA\OOGO\Documents\Brandbook images\catalog`

Selected brand images:

- Main hero: `ChatGPT Image 2026년 5월 26일 오후 05_54_02.png`
- Brand-to-collection bridge: `ChatGPT Image 2026년 5월 26일 오후 10_12_12.png`

## Brand Direction

OOGO is presented as a premium eyewear brand built around quiet confidence, refined perspective, and the relationship between light, shadow, gaze, memory, and frame.

Core language:

- "Light & Shadow Gallery"
- "Quiet confidence begins with attitude."
- "OOGO frames a way of seeing - clear, balanced, and quietly confident."
- "OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다."

The visual tone should avoid loud luxury. It should use restrained typography, architectural shadows, neutral material textures, dark gallery spaces, and product imagery with strong light direction.

## Product Direction

The main site direction combines:

- A-type brand gallery for the homepage hero and story sections.
- B-type catalog showroom for collection and product sections.

The collection should support catalog-style product browsing with model code, multilingual product names, frame material, lens material, UV400 protection, coating and performance notes, and size.

Initial product data comes from the OOGO catalog PDF. Examples include:

- `OG26001C2` - 황혼의 산책 / Sunset Stroll
- `OG26001C3` - 안개 속 산책 / Misty Walk
- `OG26002C1` - 블랙 문 / Black Moon
- `OG26002C3` - 화이트 클라우드 / White Cloud
- `OG26003C3` - 포레스트 딥 / Forest Deep
- `OG26003C4` - 실버 미스트 / Silver Mist
- `OG26012C2` - 앰버 글로우 / Amber Glow

## Languages

The site must support Korean, English, and Chinese.

Language behavior:

- Public site has a KR / EN / CN selector.
- Admin dashboard edits landing pages and products per locale.
- Product records store shared technical fields once, with localized display fields for name, description, and marketing copy.
- If a localized field is missing, the admin should make that visible instead of silently publishing incomplete content.

## Architecture

Use a Vercel + Supabase + admin dashboard architecture.

Public site:

- Hosted at `www.oogolaps.com`.
- Reads only published content.
- Uses OOGO brand imagery, landing-page blocks, published products, special edition content, company information, and contact information from Supabase.
- Must remain fast and visually polished even though content is managed.

Admin dashboard:

- Hosted under `/admin`.
- Uses Supabase Auth for login.
- Lets the owner manage products, files, landing-page content, company/brand info, legal links, and inquiries.
- Uses a dark, restrained dashboard style similar in operational feel to the existing Orthia dashboard, adapted to OOGO's darker gallery tone.

Backend:

- Supabase Postgres stores structured content.
- Supabase Storage stores uploaded product and brand images.
- Supabase Row Level Security protects admin-only writes.
- Public read policies expose only published content needed by the public site.

## Public Site Structure

Primary sections:

1. Header
   - OOGO logo
   - Navigation: Brand, Collection, Special Edition, Inquiry
   - KR / EN / CN language selector

2. Home hero
   - Uses selected hero image.
   - Presents "Light & Shadow Gallery" and the quiet-confidence headline.
   - Gives immediate premium brand impression.

3. Brand Story
   - About OOGO.
   - Brand statement.
   - Brand essence: Quiet, Human, Light, Shadow, Memory, Frame.
   - Design philosophy: Proportion, Balance, Comfort, Clarity, Timeless Form.

4. Collection
   - Showroom-style product grid.
   - Highlight selected products on the homepage.
   - Link to full product listing and product detail.

5. Product Detail
   - Product images.
   - Model code.
   - Localized name.
   - Frame and lens specifications.
   - Size.
   - Publish status controlled in admin.

6. Special Edition
   - Presents Youngbin Edition as an optional campaign section.
   - Uses "Light / Gaze / Memory" and limited-edition messaging.
   - Can be hidden or shown from admin.

7. Inquiry
   - Supports general inquiries.
   - Supports buyer and retail-partnership inquiries.
   - Includes direct contact options such as email, phone, and social links.

8. Footer
   - Company and brand information.
   - Contact details.
   - Legal links.
   - Social links.

## Admin Dashboard Structure

Dashboard:

- Summary cards: products, published products, open inquiries, landing-page draft status.
- Shortcuts to add product, edit landing page, manage files, and open public page.

Products:

- Product upload.
- Product library.
- Fields: model code, localized names, category, colorway, size, frame material, lens material, lens features, product images, sort order, publish status, featured status.
- Product data should support KR / EN / CN display.

Landing Page:

- Page selector: Header, Home, Brand Story, Collection, Product Detail, Special Edition, Inquiry, Footer.
- Locale selector: KR / EN / CN.
- Block editor for image and text fields.
- Save and publish workflow.
- Draft indicator when unpublished changes exist.

Files:

- Upload and manage brand assets and product images.
- Copy image URL or select image inside landing/product editors.
- Separate conceptual grouping for brand images, product images, and special edition images.

Inquiries:

- Capture public inquiry form submissions.
- Show inquiry type: general, buyer, retail, collaboration, other.
- Show sender, company, country, email, phone, message, status, created date.
- Allow status changes such as open, in progress, closed.

Company & Brand:

- Company name, brand description, emails, phone, address, SNS links.
- Footer text per locale.

Legal:

- Privacy policy and terms links or page content.

Users & Roles:

- Start with a small admin-only model.
- Keep future support for roles such as owner, editor, viewer.

## Suggested Supabase Data Model

Core tables:

- `profiles`: user metadata and role.
- `assets`: uploaded file metadata and storage path.
- `products`: shared product fields, publish status, featured status, sort order.
- `product_translations`: locale-specific product names and copy.
- `product_images`: product image relations and sort order.
- `landing_pages`: page keys and publish state.
- `landing_blocks`: block keys, page key, locale, editable JSON content, draft/published state.
- `company_settings`: shared company and brand settings.
- `company_translations`: localized footer and brand text.
- `inquiries`: public inquiry submissions and admin status.

Important constraints:

- Use stable page keys and block keys instead of hard-coded copy in components.
- Store product specifications in structured fields where possible.
- Store flexible landing-page block content as JSON only where page layouts need varied fields.
- Public site queries only published products and published landing blocks.

## Deployment

- Vercel hosts both the public site and admin dashboard.
- Supabase environment variables are configured in Vercel.
- `www.oogolaps.com` points to the Vercel deployment.
- `/admin` is protected by Supabase Auth.

## MVP Scope

The first implementation should include:

- Public homepage with Header, Home, Brand Story, Collection preview, Special Edition preview, Inquiry, Footer.
- Product listing and basic product detail.
- KR / EN / CN language switching.
- Admin login.
- Product create/edit/publish.
- Landing Page editor for Header, Home, Brand Story, Collection, Special Edition, Inquiry, Footer.
- File upload and asset selection.
- Inquiry form submission and admin inquiry list.
- Company & Brand settings.

The first version does not need:

- Complex role permissions beyond admin.
- Full activity log.
- Advanced version history.
- SEO editor for every page.
- Automated translation.
- Payment or ecommerce checkout.

## Testing And Verification

Verification should cover:

- Public homepage rendering in desktop and mobile.
- Language switching across KR / EN / CN.
- Product publish/unpublish behavior.
- Landing-page draft and publish behavior.
- Image upload and display.
- Inquiry form submission and admin visibility.
- Supabase RLS behavior for public reads and admin writes.
- Vercel production build.

## Implementation Assumptions

- Technology choice: use Next.js because it supports public pages, admin routes, API routes, Vercel deployment, and Supabase integration cleanly.
- Contact channels: include editable email, phone, KakaoTalk, and Instagram fields in admin. Values can be blank at launch; blank channels should not render on the public site.
- Product Detail: include a basic product detail page in MVP so catalog cards have a natural destination.
- Special Edition: include it as an admin-controlled section with a show/hide toggle.

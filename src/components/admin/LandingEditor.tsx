import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { getLandingEditorPages, landingPageOptions } from "@/lib/admin-content";
import { getProductCatalogHref } from "@/lib/products";

type LandingBlockRow = {
  id: string;
  block_key: string;
  draft_content: Record<string, unknown>;
  published_content: Record<string, unknown>;
  published: boolean;
};

type AssetOption = {
  id: string;
  public_url: string;
  alt: string | null;
  kind: string;
};

type LandingEditorProps = {
  pageKey: string;
  locale: Locale;
  blocks: LandingBlockRow[];
  assets?: AssetOption[];
  saveAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
};

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select" | "url";
  options?: Array<{ label: string; value: string }>;
  wide?: boolean;
};

type BlockConfig = {
  key: string;
  title: string;
  note: string;
  media?: boolean;
  mediaGuidance?: string;
  fields: FieldConfig[];
};

const commonCopyFields: FieldConfig[] = [
  { name: "eyebrow", label: "작은 제목", placeholder: "예: 2026 Collection" },
  { name: "heading", label: "메인 제목", placeholder: "섹션 제목" },
  { name: "body", label: "설명", type: "textarea", placeholder: "홈페이지에 노출될 문구", wide: true },
  { name: "primaryLabel", label: "버튼 문구", placeholder: "View more" },
  { name: "primaryHref", label: "이동 링크", placeholder: getProductCatalogHref() }
];

const homeBlocks: BlockConfig[] = [
  {
    key: "hero",
    title: "Hero",
    note: "첫 화면 이미지/영상, 메인 문구, 버튼",
    media: true,
    mediaGuidance:
      "Image 2400 x 1500px recommended, JPG/PNG/WebP max 8MB. Video 1920 x 1080 or 1920 x 1200, MP4/WebM max 25MB, muted loop style.",
    fields: [
      { name: "eyebrow", label: "작은 제목", placeholder: "Light, framed softly" },
      { name: "heading", label: "로고/타이틀", placeholder: "OOGO" },
      { name: "line", label: "메인 문장", placeholder: "Quiet confidence, shaped for everyday light.", wide: true },
      { name: "body", label: "설명", type: "textarea", placeholder: "OOGO는 균형과 인상을 담은 한국 아이웨어입니다.", wide: true },
      { name: "primaryLabel", label: "1차 버튼 문구", placeholder: "Collection" },
      { name: "primaryHref", label: "1차 버튼 링크", placeholder: getProductCatalogHref() },
      { name: "secondaryLabel", label: "2차 버튼 문구", placeholder: "Brand story" },
      { name: "secondaryHref", label: "2차 버튼 링크", placeholder: "#brand" }
    ]
  },
  {
    key: "brand-essence",
    title: "Brand Essence",
    note: "브랜드 소개 섹션",
    media: true,
    mediaGuidance: "Recommended 1800 x 1400px, showroom or brand mood image, JPG/PNG/WebP max 8MB.",
    fields: commonCopyFields
  },
  {
    key: "collection-preview",
    title: "Collection",
    note: "상품 컬렉션 소개",
    fields: commonCopyFields
  },
  {
    key: "wearing",
    title: "Wearing",
    note: "착용 이미지 섹션",
    media: true,
    mediaGuidance: "Recommended 1600 x 2000px portrait or 2400 x 1500px landscape, JPG/PNG/WebP max 8MB.",
    fields: commonCopyFields
  },
  {
    key: "special-preview",
    title: "Special Edition",
    note: "스페셜 에디션 소개",
    media: true,
    mediaGuidance: "Recommended 2000 x 1400px campaign image, JPG/PNG/WebP max 8MB.",
    fields: commonCopyFields
  },
  {
    key: "inquiry-preview",
    title: "Inquiry",
    note: "문의 안내 섹션",
    fields: commonCopyFields
  }
];

const pageBlockMap: Record<string, BlockConfig[]> = {
  header: [
    {
      key: "main",
      title: "Header",
      note: "로고, 메인 메뉴, 언어 선택, 우측 버튼",
      media: true,
      mediaGuidance: "Logo image: transparent PNG/WebP, wide ratio around 3:1, minimum 240px wide.",
      fields: [
        { name: "logoLabel", label: "로고 대체 문구", placeholder: "OOGO" },
        { name: "logoHref", label: "로고 클릭 링크", placeholder: "/" },
        { name: "nav1Label", label: "메뉴 1 이름", placeholder: "Collection" },
        { name: "nav1Href", label: "메뉴 1 링크", placeholder: "/#collection" },
        { name: "nav2Label", label: "메뉴 2 이름", placeholder: "Projects" },
        { name: "nav2Href", label: "메뉴 2 링크", placeholder: "/#projects" },
        { name: "nav3Label", label: "메뉴 3 이름", placeholder: "Archive" },
        { name: "nav3Href", label: "메뉴 3 링크", placeholder: "/#archive" },
        { name: "nav4Label", label: "메뉴 4 이름", placeholder: "Inquiry" },
        { name: "nav4Href", label: "메뉴 4 링크", placeholder: "/#inquiry" },
        { name: "utilityLabel", label: "추가 버튼 문구", placeholder: "Shop" },
        { name: "utilityHref", label: "추가 버튼 링크", placeholder: "https://..." },
        {
          name: "showLocale",
          label: "언어 선택 표시",
          type: "select",
          options: [
            { label: "보이기", value: "true" },
            { label: "숨기기", value: "false" }
          ]
        }
      ]
    }
  ],
  home: homeBlocks,
  "brand-story": [
    {
      key: "story-hero",
      title: "Brand Story Hero",
      note: "Subpage hero copy and visual",
      media: true,
      mediaGuidance: "Recommended 2400 x 1400px, editorial brand image, JPG/PNG/WebP max 8MB.",
      fields: commonCopyFields
    },
    {
      key: "philosophy",
      title: "Philosophy",
      note: "Core brand paragraph and supporting image",
      media: true,
      fields: commonCopyFields
    }
  ],
  collection: [
    {
      key: "collection-hero",
      title: "Collection Hero",
      note: "Products page intro copy and image",
      media: true,
      fields: commonCopyFields
    },
    {
      key: "filter-copy",
      title: "Category / Filter Copy",
      note: "Short helper copy for product listing",
      fields: commonCopyFields
    }
  ],
  "product-detail": [
    {
      key: "detail-template",
      title: "Product Detail Template",
      note: "Reusable labels and CTA copy for product modal/detail",
      fields: [
        { name: "specTitle", label: "Spec title", placeholder: "Details" },
        { name: "buyerCta", label: "Buyer CTA", placeholder: "Request buyer catalog" },
        { name: "relatedTitle", label: "Related title", placeholder: "More frames" },
        { name: "body", label: "Helper copy", type: "textarea", wide: true }
      ]
    }
  ],
  "special-edition": [
    {
      key: "special-hero",
      title: "Special Edition Hero",
      note: "Special edition landing copy and campaign visual",
      media: true,
      mediaGuidance: "Recommended 2400 x 1500px campaign image or MP4/WebM short loop, max 25MB for video.",
      fields: commonCopyFields
    },
    {
      key: "collaboration-guide",
      title: "Collaboration Guide",
      note: "Reusable copy for future special edition collaborations",
      fields: commonCopyFields
    }
  ],
  inquiry: [
    {
      key: "inquiry-main",
      title: "Inquiry Page",
      note: "Contact copy, category chips, and form helper",
      fields: commonCopyFields
    }
  ],
  footer: [
    {
      key: "main",
      title: "Footer",
      note: "하단 브랜드 문구, 연락처, SNS, 카피라이트",
      fields: [
        { name: "brandDescription", label: "브랜드 설명", type: "textarea", wide: true },
        { name: "email", label: "Email", placeholder: "contact@oogolabs.com" },
        { name: "address", label: "주소", placeholder: "Seoul, Korea" },
        { name: "instagram", label: "Instagram URL", placeholder: "https://www.instagram.com/oogolabs" },
        { name: "facebook", label: "Facebook URL", placeholder: "https://www.facebook.com/oogolabs" },
        { name: "tiktok", label: "TikTok URL", placeholder: "https://www.tiktok.com/@oogolabs" },
        { name: "copyright", label: "Copyright", placeholder: "© 2026 OOGO. All rights reserved.", wide: true }
      ]
    }
  ]
};

function textValue(content: Record<string, unknown>, key: string) {
  const value = content[key];
  return typeof value === "string" ? value : "";
}

function selectValue(content: Record<string, unknown>, key: string, fallback: string) {
  const value = textValue(content, key);
  return value || fallback;
}

function getBlock(blocks: LandingBlockRow[], blockKey: string) {
  return blocks.find((block) => block.block_key === blockKey) ?? null;
}

function statusLabel(block: LandingBlockRow | null) {
  if (!block) {
    return "새 초안";
  }
  return block.published ? "게시됨" : "초안 저장됨";
}

function pageTitle(pageKey: string) {
  const editorPages = getLandingEditorPages();
  return editorPages.find((page) => page.key === pageKey)?.label ?? landingPageOptions.find((option) => option.key === pageKey)?.label ?? pageKey;
}

function publicHref(pageKey: string) {
  const editorPages = getLandingEditorPages();
  return editorPages.find((page) => page.key === pageKey)?.publicHref ?? "/";
}

function previewText(content: Record<string, unknown>, blockConfig: BlockConfig) {
  return (
    textValue(content, "heading") ||
    textValue(content, "line") ||
    textValue(content, "body") ||
    textValue(content, "brandDescription") ||
    blockConfig.note
  );
}

function mediaUrl(content: Record<string, unknown>) {
  return textValue(content, "mediaUrl") || textValue(content, "imageUrl");
}

function Field({ field, content }: { field: FieldConfig; content: Record<string, unknown> }) {
  const className = field.wide ? "admin-wide-field" : undefined;

  if (field.type === "textarea") {
    return (
      <label className={className}>
        {field.label}
        <textarea name={field.name} defaultValue={textValue(content, field.name)} placeholder={field.placeholder} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={className}>
        {field.label}
        <select name={field.name} defaultValue={selectValue(content, field.name, field.options?.[0]?.value ?? "")}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className={className}>
      {field.label}
      <input name={field.name} defaultValue={textValue(content, field.name)} placeholder={field.placeholder} type={field.type === "url" ? "url" : "text"} />
    </label>
  );
}

function MediaPanel({ content, block, assets }: { content: Record<string, unknown>; block: BlockConfig; assets: AssetOption[] }) {
  const mediaType = selectValue(content, "mediaType", "image");
  const currentMediaUrl = mediaUrl(content);

  return (
    <aside className="admin-asset-panel landing-media-panel">
      <div className="admin-section-heading">
        <span>이미지 / 영상</span>
        <small>Image / Video</small>
      </div>
      <label>
        미디어 종류
        <select name="mediaType" defaultValue={mediaType}>
          <option value="image">이미지</option>
          <option value="video">동영상</option>
        </select>
      </label>
      <label>
        이미지/영상 주소
        <input name="mediaUrl" list="landing-asset-options" defaultValue={currentMediaUrl} placeholder="/images/oogo-hero.png or storage URL" />
      </label>
      <label>
        동영상 대체 이미지
        <input name="posterUrl" list="landing-asset-options" defaultValue={textValue(content, "posterUrl")} placeholder="동영상일 때 권장" />
      </label>
      <div className="landing-file-actions">
        <a href="/admin/files" target="_blank" rel="noreferrer">
          Files에서 선택
        </a>
        <small>Files에서 URL을 복사해 붙여넣거나 바로 업로드하세요.</small>
      </div>
      <label className="admin-upload-control">
        <span>파일 업로드</span>
        <em>{block.mediaGuidance ?? "JPG/PNG/WebP image max 8MB. MP4/WebM video max 25MB."}</em>
        <input name="mediaFile" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" />
      </label>
      {currentMediaUrl ? (
        mediaType === "video" ? (
          <video className="landing-media-preview" src={currentMediaUrl} poster={textValue(content, "posterUrl")} muted controls />
        ) : (
          <div className="landing-media-preview" style={{ backgroundImage: `url("${currentMediaUrl}")` }} />
        )
      ) : (
        <div className="landing-media-preview landing-media-preview-empty">현재 공개 기본 이미지 사용 중</div>
      )}
      <datalist id="landing-asset-options">
        {assets.map((asset) => (
          <option key={asset.id} value={asset.public_url}>
            {asset.alt || asset.kind}
          </option>
        ))}
      </datalist>
    </aside>
  );
}

function BlockEditor({
  blockConfig,
  row,
  pageKey,
  locale,
  assets,
  saveAction,
  publishAction,
  initiallyOpen
}: {
  blockConfig: BlockConfig;
  row: LandingBlockRow | null;
  pageKey: string;
  locale: Locale;
  assets: AssetOption[];
  saveAction: LandingEditorProps["saveAction"];
  publishAction: LandingEditorProps["publishAction"];
  initiallyOpen: boolean;
}) {
  const content = row?.draft_content ?? {};
  const currentMediaUrl = mediaUrl(content);

  return (
    <section className="landing-block-editor">
      <details open={initiallyOpen}>
        <summary>
          <div className="landing-section-card-preview">
            {currentMediaUrl ? (
              <div className="landing-summary-thumb" style={{ backgroundImage: `url("${currentMediaUrl}")` }} />
            ) : (
              <div className="landing-summary-thumb landing-summary-thumb-empty">{blockConfig.media ? "Media" : "Text"}</div>
            )}
            <span className="landing-summary-copy">
              <strong>{blockConfig.title}</strong>
              <small>{previewText(content, blockConfig)}</small>
            </span>
          </div>
          <span className="landing-summary-action">
            <em className={row?.published ? "status-published" : "status-draft"}>{statusLabel(row)}</em>
            <b>Edit</b>
          </span>
        </summary>

        <form className="admin-form" action={saveAction}>
          <input type="hidden" name="id" value={row?.id ?? ""} />
          <input type="hidden" name="pageKey" value={pageKey} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="blockKey" value={blockConfig.key} />
          <div className="landing-editor-grid">
            <div className="admin-form-section">
              <div className="admin-section-heading">
                <span>텍스트</span>
                <small>{locale.toUpperCase()}</small>
              </div>
              <div className="admin-form-grid">
                {blockConfig.fields.map((field) => (
                  <Field key={field.name} field={field} content={content} />
                ))}
              </div>
            </div>
            {blockConfig.media ? <MediaPanel content={content} block={blockConfig} assets={assets} /> : null}
          </div>
          <div className="landing-form-actions">
            <button type="submit">초안 저장</button>
          </div>
        </form>

        {row?.id ? (
          <form className="landing-publish-form" action={publishAction}>
            <input type="hidden" name="id" value={row.id} />
            <button className="admin-secondary-button" type="submit">
              게시하기
            </button>
          </form>
        ) : null}
      </details>
    </section>
  );
}

export function LandingEditor({ pageKey, locale, blocks, assets = [], saveAction, publishAction }: LandingEditorProps) {
  const editorPages = getLandingEditorPages();
  const pageBlocks = pageBlockMap[pageKey] ?? [
    {
      key: "main",
      title: landingPageOptions.find((option) => option.key === pageKey)?.label ?? pageKey,
      note: "Page copy and primary visual",
      media: true,
      fields: commonCopyFields
    }
  ];
  const currentPageTitle = pageTitle(pageKey);

  return (
    <div className="landing-editor">
      <div className="site-editor-toolbar">
        <nav className="site-editor-tabs" aria-label="Landing page editor sections">
          {editorPages.map((page) => (
            <a key={page.key} className={page.key === pageKey ? "site-editor-tab active" : "site-editor-tab"} href={`/admin/landing?page=${page.key}&locale=${locale}`}>
              <span>{page.surface}</span>
              <strong>{page.label}</strong>
              <small>{page.routeLabel}</small>
            </a>
          ))}
        </nav>
        <div className="site-editor-actions">
          <div className="admin-locale-tabs">
            {LOCALES.map((item) => (
              <a key={item} className={item === locale ? "active" : undefined} href={`/admin/landing?page=${pageKey}&locale=${item}`}>
                {LOCALE_LABELS[item]}
              </a>
            ))}
          </div>
          <a className="landing-open-public" href={publicHref(pageKey)} target="_blank" rel="noreferrer">
            공개 페이지 보기
          </a>
        </div>
      </div>

      <div className="landing-page-summary">
        <div>
          <span>{currentPageTitle}</span>
          <strong>{pageBlocks.length}개 섹션 편집</strong>
        </div>
        <p>
          {editorPages.find((page) => page.key === pageKey)?.description ??
            "카드를 열어 수정하고, 초안 저장 후 게시하면 홈페이지에 반영됩니다."}
        </p>
      </div>

      <div className="landing-block-list">
        {pageBlocks.map((blockConfig, index) => (
          <BlockEditor
            key={blockConfig.key}
            blockConfig={blockConfig}
            row={getBlock(blocks, blockConfig.key)}
            pageKey={pageKey}
            locale={locale}
            assets={assets}
            saveAction={saveAction}
            publishAction={publishAction}
            initiallyOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

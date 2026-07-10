"use client";

import React, { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { getProductImageSlots } from "@/lib/product-images";

type TranslationValue = {
  name?: string;
  colorway?: string | null;
  description?: string | null;
  size_note?: string | null;
  frame_material?: string | null;
  lens_material?: string | null;
  lens_features?: string[] | null;
};

type ProductFormProps = {
  product?: {
    id?: string;
    slug?: string | null;
    model_code?: string | null;
    size?: string | null;
    frame_material?: string | null;
    lens_material?: string | null;
    lens_features?: string[] | null;
    published?: boolean | null;
    featured?: boolean | null;
    product_translations?: Array<TranslationValue & { locale: string }>;
    product_images?: Array<{
      role?: string | null;
      assets?: { public_url?: string | null } | Array<{ public_url?: string | null }> | null;
    }>;
  } | null;
  action: (formData: FormData) => void | Promise<void>;
  supabaseConfigured?: boolean;
};

function translationFor(product: ProductFormProps["product"], locale: Locale): TranslationValue {
  const translation: TranslationValue = product?.product_translations?.find((item) => item.locale === locale) ?? {};

  return {
    ...translation,
    frame_material: translation.frame_material ?? product?.frame_material ?? "",
    lens_material: translation.lens_material ?? product?.lens_material ?? "",
    lens_features: translation.lens_features?.length ? translation.lens_features : product?.lens_features ?? []
  };
}

function imageUrlFor(product: ProductFormProps["product"], role: string) {
  const asset = product?.product_images?.find((item) => item.role === role)?.assets;

  if (Array.isArray(asset)) {
    return asset[0]?.public_url ?? "";
  }

  return asset?.public_url ?? "";
}

export function ProductForm({ product, action, supabaseConfigured = true }: ProductFormProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("ko");
  const imageSlots = getProductImageSlots();
  const canPersist = supabaseConfigured;
  const isEditing = Boolean(product?.id);

  return (
    <form className="admin-form admin-product-form" action={action}>
      {!canPersist ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>상품 저장과 이미지 업로드는 Supabase 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="admin-product-editor">
        <div className="admin-product-main">
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Shared product</span>
              <small>모든 언어에 공통으로 표시되는 기본 정보입니다.</small>
            </div>
            <div className="admin-form-grid">
              <label>
                Model code <small>상품 상세 상단의 코드 라벨에 표시됩니다.</small>
                <input name="modelCode" defaultValue={product?.model_code ?? ""} required />
              </label>
              <label>
                Slug <small>공개 주소는 /products/[slug] 형식입니다.</small>
                <input name="slug" defaultValue={product?.slug ?? ""} required />
              </label>
              <label>
                Size <small>언어와 관계없이 동일한 규격값을 사용합니다.</small>
                <input name="size" defaultValue={product?.size ?? ""} placeholder="63-17-145" />
              </label>
            </div>
          </section>

          <section className="admin-form-section admin-localized-product-section">
            <div className="admin-section-heading admin-section-heading-with-tabs">
              <div>
                <span>Localized content</span>
                <small>선택한 언어의 상품명과 상세 스펙을 입력합니다.</small>
              </div>
              <div className="admin-segmented-control" role="tablist" aria-label="Product content language">
                {LOCALES.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    role="tab"
                    id={`product-locale-tab-${locale}`}
                    aria-controls={`product-locale-panel-${locale}`}
                    aria-selected={activeLocale === locale}
                    aria-pressed={activeLocale === locale}
                    onClick={() => setActiveLocale(locale)}
                  >
                    {LOCALE_LABELS[locale]}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-locale-panels">
              {LOCALES.map((locale) => {
                const translation = translationFor(product, locale);

                return (
                  <fieldset
                    className="admin-locale-panel"
                    key={locale}
                    role="tabpanel"
                    id={`product-locale-panel-${locale}`}
                    aria-labelledby={`product-locale-tab-${locale}`}
                    hidden={activeLocale !== locale}
                    aria-label={`${LOCALE_LABELS[locale]} product content`}
                  >
                    <div className="admin-form-grid">
                      <label>
                        Name <small>{locale === "ko" ? "한국어 상품명은 필수입니다." : "해당 언어의 상품명입니다."}</small>
                        <input name={`${locale}.name`} defaultValue={translation.name ?? ""} required={locale === "ko"} />
                      </label>
                      <label>
                        Colorway <small>컬러 또는 톤 이름을 입력합니다.</small>
                        <input name={`${locale}.colorway`} defaultValue={translation.colorway ?? ""} />
                      </label>
                      <label className="admin-wide-field">
                        Description <small>상품 상세에 사용할 간단한 설명입니다.</small>
                        <textarea name={`${locale}.description`} defaultValue={translation.description ?? ""} />
                      </label>
                    </div>

                    <div className="admin-subsection-heading">
                      <strong>Detail specs</strong>
                      <span>공개 상품 상세의 Frame, Lens, Size 행에 표시됩니다.</span>
                    </div>
                    <div className="admin-form-grid">
                      <label>
                        Size note <small>공통 Size 아래에 표시할 언어별 보조 설명입니다.</small>
                        <input name={`${locale}.sizeNote`} defaultValue={translation.size_note ?? ""} />
                      </label>
                      <label>
                        Frame material <small>Frame 행의 주요 설명입니다.</small>
                        <input name={`${locale}.frameMaterial`} defaultValue={translation.frame_material ?? ""} />
                      </label>
                      <label>
                        Lens material <small>Lens 행의 주요 설명입니다.</small>
                        <input name={`${locale}.lensMaterial`} defaultValue={translation.lens_material ?? ""} />
                      </label>
                      <label className="admin-wide-field">
                        Lens features <small>한 줄에 한 항목씩 입력합니다.</small>
                        <textarea
                          name={`${locale}.lensFeaturesText`}
                          defaultValue={(translation.lens_features ?? []).join("\n")}
                        />
                      </label>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="admin-asset-panel" aria-label="Visual Assets">
          <div className="admin-section-heading">
            <span>Detail gallery</span>
            <small>공개 페이지에 표시되는 순서입니다.</small>
          </div>
          <div className="admin-image-slots">
            {imageSlots.map((slot) => (
              <div className="admin-image-slot" key={slot.role}>
                <div className="admin-image-slot-copy">
                  <span>{slot.label}</span>
                  <small>{slot.note}</small>
                  <em>{slot.guidance}</em>
                </div>
                {imageUrlFor(product, slot.role) ? (
                  <div
                    className="admin-image-preview"
                    aria-label={`${slot.label} current image preview`}
                    style={{ backgroundImage: `url("${imageUrlFor(product, slot.role)}")` }}
                  />
                ) : (
                  <div className="admin-image-preview admin-image-preview-empty">이미지 없음</div>
                )}
                <label className="admin-upload-control">
                  <span>Upload image</span>
                  <input
                    name={`imageFile.${slot.role}`}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={!canPersist}
                  />
                </label>
                <input type="hidden" name={`image.${slot.role}`} defaultValue={imageUrlFor(product, slot.role)} />
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="admin-form-actions admin-product-actions">
        <div className="admin-publish-controls">
          <label className="admin-checkbox">
            <input name="featured" type="checkbox" defaultChecked={Boolean(product?.featured)} />
            Featured
          </label>
          <label className="admin-checkbox">
            <input name="published" type="checkbox" defaultChecked={Boolean(product?.published)} />
            Public on site
          </label>
        </div>
        <div className="admin-action-buttons">
          <a className="admin-secondary-button" href="/admin/products">
            Cancel
          </a>
          <button className="admin-primary-button" type="submit" disabled={!canPersist}>
            {canPersist ? (isEditing ? "Save changes" : "Create product") : "Supabase 연결 필요"}
          </button>
        </div>
      </div>
    </form>
  );
}

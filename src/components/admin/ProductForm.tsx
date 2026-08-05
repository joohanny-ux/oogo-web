"use client";

import React, { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { initialProductSaveState, type ProductSaveState } from "@/lib/admin-product-save";
import { getProductImageSlots, type ProductImageRole } from "@/lib/product-images";
import { formatProductLensText } from "@/lib/products";

type TranslationValue = {
  name?: string;
  colorway?: string | null;
  description?: string | null;
  frame_size?: string | null;
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
    reference_color_name?: string | null;
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
  action: (prevState: ProductSaveState, formData: FormData) => Promise<ProductSaveState>;
  supabaseConfigured?: boolean;
};

function translationFor(product: ProductFormProps["product"], locale: Locale): TranslationValue {
  const translation: TranslationValue = product?.product_translations?.find((item) => item.locale === locale) ?? {};

  return {
    ...translation,
    frame_size: translation.frame_size ?? product?.size ?? "",
    colorway: translation.colorway ?? product?.reference_color_name ?? "",
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

function ProductSubmitButton({
  canPersist,
  isEditing,
  uploading
}: {
  canPersist: boolean;
  isEditing: boolean;
  uploading: boolean;
}) {
  const { pending } = useFormStatus();
  const busy = uploading || pending;

  return (
    <button className="admin-primary-button" type="submit" disabled={!canPersist || busy}>
      {!canPersist
        ? "Supabase 연결 필요"
        : busy
          ? uploading
            ? "Uploading images..."
            : "Saving..."
          : isEditing
            ? "Save changes"
            : "Create product"}
    </button>
  );
}

export function ProductForm({ product, action, supabaseConfigured = true }: ProductFormProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("ko");
  const [state, formAction] = useActionState(action, initialProductSaveState);
  const [clientMessage, setClientMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const imageSlots = getProductImageSlots();
  const canPersist = supabaseConfigured;
  const isEditing = Boolean(product?.id);
  const initialImageUrls = useMemo(() => {
    const values = {} as Record<ProductImageRole, string>;
    for (const slot of imageSlots) {
      values[slot.role] = imageUrlFor(product, slot.role);
    }
    return values;
  }, [imageSlots, product]);
  const [imageUrls, setImageUrls] = useState<Record<ProductImageRole, string>>(initialImageUrls);
  const statusMessage = clientMessage || state.message;
  const statusOk = !clientMessage && state.ok;

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      window.location.assign(state.redirectTo);
    }
  }, [state]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPersist || uploading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const slug = String(formData.get("slug") ?? "").trim();
    const modelCode = String(formData.get("modelCode") ?? "").trim();
    const nextUrls = { ...imageUrls };

    setUploading(true);
    setClientMessage("");

    try {
      for (const slot of imageSlots) {
        const input = form.elements.namedItem(`imageFile.${slot.role}`);
        if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
          continue;
        }

        const file = input.files[0];
        const response = await fetch("/api/admin/products/upload", {
          method: "POST",
          headers: {
            "content-type": file.type || "application/octet-stream",
            "x-product-role": slot.role,
            "x-product-slug": encodeURIComponent(slug),
            "x-product-model": encodeURIComponent(modelCode),
            "x-product-file-name": encodeURIComponent(file.name || `${slot.role}.webp`)
          },
          body: file
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string; url?: string };
        if (!response.ok || !payload.url) {
          setClientMessage(payload.message || `${slot.label} 이미지 업로드에 실패했습니다.`);
          return;
        }

        nextUrls[slot.role] = payload.url;
        input.value = "";
      }

      setImageUrls(nextUrls);

      const saveData = new FormData(form);
      for (const slot of imageSlots) {
        saveData.set(`image.${slot.role}`, nextUrls[slot.role] || "");
        saveData.delete(`imageFile.${slot.role}`);
      }

      formAction(saveData);
    } catch (error) {
      setClientMessage(error instanceof Error ? error.message : "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="admin-form admin-product-form" onSubmit={handleSubmit}>
      {!canPersist ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>상품 저장과 이미지 업로드는 Supabase 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      {statusMessage ? (
        <div className={`admin-config-warning${statusOk ? "" : " is-error"}`} role="status">
          <strong>{statusOk ? "Saved" : "Save failed"}</strong>
          <p>{statusMessage}</p>
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
                OOGO No. <small>상품 상세 상단의 코드 라벨에 표시됩니다.</small>
                <input name="modelCode" defaultValue={product?.model_code ?? ""} required />
              </label>
              <label>
                Slug <small>공개 주소는 /products/[slug] 형식입니다.</small>
                <input name="slug" defaultValue={product?.slug ?? ""} required />
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
                        Product Name <small>{locale === "ko" ? "한국어 상품명은 필수입니다." : "해당 언어의 상품명입니다."}</small>
                        <input name={`${locale}.name`} defaultValue={translation.name ?? ""} required={locale === "ko"} />
                      </label>
                      <label className="admin-wide-field">
                        Frame <small>해당 언어의 프레임 정보를 입력합니다.</small>
                        <input name={`${locale}.frame`} defaultValue={translation.frame_material ?? ""} />
                      </label>
                      <label className="admin-wide-field">
                        Lens <small>표의 Lens 셀을 그대로 입력하거나, 항목을 | 또는 줄바꿈으로 구분합니다.</small>
                        <textarea
                          name={`${locale}.lens`}
                          defaultValue={formatProductLensText(
                            translation.lens_material,
                            translation.lens_features ?? []
                          )}
                        />
                      </label>
                      <label>
                        Frame Size <small>예: 63□17-145</small>
                        <input
                          name={`${locale}.frameSize`}
                          defaultValue={translation.frame_size ?? ""}
                          placeholder="63□17-145"
                        />
                      </label>
                      <label>
                        Frame Size Description <small>렌즈, 브리지, 다리 길이를 해당 언어로 설명합니다.</small>
                        <input
                          name={`${locale}.frameSizeNote`}
                          defaultValue={translation.size_note ?? ""}
                          placeholder="렌즈 63mm / 브리지 17mm / 다리 145mm"
                        />
                      </label>
                      <label className="admin-wide-field">
                        Color <small>프레임과 렌즈 컬러를 해당 언어로 입력합니다.</small>
                        <input
                          name={`${locale}.color`}
                          defaultValue={translation.colorway ?? ""}
                          placeholder="투명 브라운 프레임 + 브라운 렌즈"
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
                {imageUrls[slot.role] ? (
                  <div
                    className="admin-image-preview"
                    aria-label={`${slot.label} current image preview`}
                    style={{ backgroundImage: `url("${imageUrls[slot.role]}")` }}
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
                    disabled={!canPersist || uploading}
                  />
                </label>
                <input type="hidden" name={`image.${slot.role}`} value={imageUrls[slot.role] || ""} readOnly />
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
          <ProductSubmitButton canPersist={canPersist} isEditing={isEditing} uploading={uploading} />
        </div>
      </div>
    </form>
  );
}

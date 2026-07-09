import React from "react";
import type { Locale } from "@/lib/i18n";
import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import { getProductImageSlots } from "@/lib/admin-content";

type TranslationValue = {
  name?: string;
  colorway?: string | null;
  description?: string | null;
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
  return product?.product_translations?.find((item) => item.locale === locale) ?? {};
}

function imageUrlFor(product: ProductFormProps["product"], role: string) {
  const asset = product?.product_images?.find((item) => item.role === role)?.assets;

  if (Array.isArray(asset)) {
    return asset[0]?.public_url ?? "";
  }

  return asset?.public_url ?? "";
}

export function ProductForm({ product, action, supabaseConfigured = true }: ProductFormProps) {
  const imageSlots = getProductImageSlots();
  const canPersist = supabaseConfigured;

  return (
    <form className="admin-form" action={action}>
      {!canPersist ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>상품 저장과 이미지 업로드는 Supabase 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="admin-product-editor">
        <div className="admin-product-main">
          <section className="admin-product-map" aria-label="Product detail page field map">
            <div>
              <span>Detail page order</span>
              <strong>Code -&gt; Name -&gt; Specs -&gt; Buyer CTA</strong>
            </div>
            <p>
              Fill the fields in the same order the public product detail page reads them. Images on the right follow
              the gallery order: Front, Angle, Side, Wearing.
            </p>
          </section>
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Detail header</span>
              <small>Code, URL, title</small>
            </div>
            <div className="admin-form-grid">
              <label>
                Model code <small>shown as the black code pill</small>
                <input name="modelCode" defaultValue={product?.model_code ?? ""} required />
              </label>
              <label>
                Slug <small>public URL: /products/[slug]</small>
                <input name="slug" defaultValue={product?.slug ?? ""} required />
              </label>
            </div>
          </section>
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Detail specs</span>
              <small>Rows under product title</small>
            </div>
            <div className="admin-form-grid">
              <label>
                Size <small>shown in the Size row</small>
                <input name="size" defaultValue={product?.size ?? ""} />
              </label>
              <label>
                Frame material <small>secondary text in Frame row</small>
                <input name="frameMaterial" defaultValue={product?.frame_material ?? ""} />
              </label>
              <label>
                Lens material <small>secondary text in Lens row</small>
                <input name="lensMaterial" defaultValue={product?.lens_material ?? ""} />
              </label>
              <label className="admin-wide-field">
                Lens features <small>one feature per line, joined in Lens detail</small>
                <textarea name="lensFeaturesText" defaultValue={(product?.lens_features ?? []).join("\n")} />
              </label>
            </div>
          </section>
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Detail copy</span>
              <small>KR name is required</small>
            </div>
            <div className="translation-panels">
              {LOCALES.map((locale) => {
                const translation = translationFor(product, locale);

                return (
                  <fieldset key={locale}>
                    <legend>{LOCALE_LABELS[locale]}</legend>
                    <label>
                      Name <small>{locale === "ko" ? "main product title" : "shown below KR title"}</small>
                      <input name={`${locale}.name`} defaultValue={translation.name ?? ""} required={locale === "ko"} />
                    </label>
                    <label>
                      Colorway <small>optional color or tone note</small>
                      <input name={`${locale}.colorway`} defaultValue={translation.colorway ?? ""} />
                    </label>
                    <label>
                      Description <small>optional detail copy for future sections</small>
                      <textarea name={`${locale}.description`} defaultValue={translation.description ?? ""} />
                    </label>
                  </fieldset>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="admin-asset-panel" aria-label="Visual Assets">
          <div className="admin-section-heading">
            <span>Detail gallery</span>
            <small>Public display order</small>
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
                  <div className="admin-image-preview admin-image-preview-empty">No image</div>
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
          <div className="admin-visibility-panel">
            <label className="admin-checkbox">
              <input name="featured" type="checkbox" defaultChecked={Boolean(product?.featured)} />
              Featured
            </label>
            <label className="admin-checkbox">
              <input name="published" type="checkbox" defaultChecked={Boolean(product?.published)} />
              Public on site
            </label>
          </div>
        </aside>
      </div>
      <button type="submit" disabled={!canPersist}>
        {canPersist ? "Save product" : "Connect Supabase to save product"}
      </button>
    </form>
  );
}

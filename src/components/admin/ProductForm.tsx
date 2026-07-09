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

export function ProductForm({ product, action }: ProductFormProps) {
  const imageSlots = getProductImageSlots();

  return (
    <form className="admin-form" action={action}>
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="admin-product-editor">
        <div className="admin-product-main">
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Identity & Specs</span>
              <small>Required product basics</small>
            </div>
            <div className="admin-form-grid">
              <label>
                Model code
                <input name="modelCode" defaultValue={product?.model_code ?? ""} required />
              </label>
              <label>
                Slug
                <input name="slug" defaultValue={product?.slug ?? ""} required />
              </label>
              <label>
                Size
                <input name="size" defaultValue={product?.size ?? ""} />
              </label>
              <label>
                Frame material
                <input name="frameMaterial" defaultValue={product?.frame_material ?? ""} />
              </label>
              <label>
                Lens material
                <input name="lensMaterial" defaultValue={product?.lens_material ?? ""} />
              </label>
              <label className="admin-wide-field">
                Lens features
                <textarea name="lensFeaturesText" defaultValue={(product?.lens_features ?? []).join("\n")} />
              </label>
            </div>
          </section>
          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span>Public Website Content</span>
              <small>KR / EN / CN</small>
            </div>
            <div className="translation-panels">
              {LOCALES.map((locale) => {
                const translation = translationFor(product, locale);

                return (
                  <fieldset key={locale}>
                    <legend>{LOCALE_LABELS[locale]}</legend>
                    <label>
                      Name
                      <input name={`${locale}.name`} defaultValue={translation.name ?? ""} required={locale === "ko"} />
                    </label>
                    <label>
                      Colorway
                      <input name={`${locale}.colorway`} defaultValue={translation.colorway ?? ""} />
                    </label>
                    <label>
                      Description
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
            <span>Visual Assets</span>
            <small>Product image roles</small>
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
                  <input name={`imageFile.${slot.role}`} type="file" accept="image/png,image/jpeg,image/webp" />
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
      <button type="submit">Save product</button>
    </form>
  );
}

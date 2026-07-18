"use client";

// 고정 개수 이미지 갤러리의 URL과 업로드 파일을 순서대로 편집한다.
import React, { useState } from "react";

type AssetOption = {
  id: string;
  public_url: string;
  alt: string | null;
  kind: string;
};

export function ImageGalleryEditor({
  initialImages,
  assets,
  canPersist,
  title,
  help,
  startIndex = 1,
  assetListId
}: {
  initialImages: string[];
  assets: AssetOption[];
  canPersist: boolean;
  title: string;
  help: string;
  startIndex?: number;
  assetListId: string;
}) {
  const [images, setImages] = useState(initialImages);

  function updateImage(index: number, value: string) {
    setImages((current) => current.map((image, imageIndex) => (imageIndex === index ? value : image)));
  }

  return (
    <aside className="admin-asset-panel landing-media-panel image-gallery-editor">
      <div className="admin-section-heading">
        <span>{title}</span>
        <small>{images.length}개</small>
      </div>
      <p className="hero-slides-help">{help}</p>
      <div className="image-gallery-editor-list">
        {images.map((imageUrl, index) => {
          const number = startIndex + index;

          return (
            <section className="image-gallery-editor-card" key={`${assetListId}-${number}`}>
              <strong>이미지 {index + 1}</strong>
              <div
                className={imageUrl ? "landing-media-preview" : "landing-media-preview landing-media-preview-empty"}
                style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
              >
                {imageUrl ? null : "이미지를 선택하거나 업로드하세요."}
              </div>
              <label>
                이미지 주소
                <input
                  name={`image${number}Url`}
                  list={assetListId}
                  value={imageUrl}
                  onChange={(event) => updateImage(index, event.target.value)}
                  placeholder="Files URL 또는 직접 주소"
                />
              </label>
              <label className="admin-upload-control">
                <span>파일 업로드</span>
                <em>JPG/PNG/WebP max 8MB.</em>
                <input
                  name={`image${number}File`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={!canPersist}
                />
              </label>
            </section>
          );
        })}
      </div>
      <datalist id={assetListId}>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.public_url}>
            {asset.alt || asset.kind}
          </option>
        ))}
      </datalist>
    </aside>
  );
}

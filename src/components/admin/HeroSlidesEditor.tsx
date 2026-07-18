"use client";

// 홈 Hero의 이미지·영상 슬라이드를 최대 다섯 개까지 편집한다.
import React, { useState } from "react";

type AssetOption = {
  id: string;
  public_url: string;
  alt: string | null;
  kind: string;
};

export type HeroSlideInput = {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl: string;
  alt: string;
  eyebrow: string;
  heading: string;
  line: string;
};

type EditableHeroSlide = HeroSlideInput & { editorId: string };

function createEmptySlide(index: number): EditableHeroSlide {
  return {
    editorId: `new-${index}`,
    id: `hero-${index + 1}`,
    mediaType: "image",
    mediaUrl: "",
    posterUrl: "",
    alt: "",
    eyebrow: "",
    heading: "",
    line: ""
  };
}

function clampIntervalSec(value: number) {
  if (!Number.isFinite(value)) return 6;
  return Math.min(15, Math.max(3, Math.round(value)));
}

export function HeroSlidesEditor({
  initialSlides,
  assets,
  canPersist,
  initialAutoplay = true,
  initialIntervalMs = 6000
}: {
  initialSlides: HeroSlideInput[];
  assets: AssetOption[];
  canPersist: boolean;
  initialAutoplay?: boolean;
  initialIntervalMs?: number;
}) {
  const [slides, setSlides] = useState<EditableHeroSlide[]>(() => {
    const normalized = initialSlides.slice(0, 5).map((slide, index) => ({
      ...slide,
      editorId: slide.id || `saved-${index}`
    }));
    return normalized.length > 0 ? normalized : [createEmptySlide(0)];
  });
  const [autoplay, setAutoplay] = useState(initialAutoplay);
  const [intervalSec, setIntervalSec] = useState(() => clampIntervalSec(initialIntervalMs / 1000));

  function updateSlide(index: number, patch: Partial<HeroSlideInput>) {
    setSlides((current) => current.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)));
  }

  function removeSlide(index: number) {
    setSlides((current) => {
      const next = current.filter((_, slideIndex) => slideIndex !== index);
      return next.length > 0 ? next : [createEmptySlide(0)];
    });
  }

  return (
    <aside className="admin-asset-panel landing-media-panel hero-slides-editor">
      <div className="admin-section-heading">
        <span>Hero 슬라이드</span>
        <small>{slides.length} / 5</small>
      </div>
      <p className="hero-slides-help">이미지 또는 영상을 공개 순서대로 등록합니다. 영상은 음소거·자동 재생·반복으로 표시됩니다.</p>

      <div className="hero-slides-playback">
        <label className="hero-slides-autoplay">
          <span>Slideshow autoplay</span>
          <button
            type="button"
            role="switch"
            aria-checked={autoplay}
            className={autoplay ? "is-on" : undefined}
            onClick={() => setAutoplay((current) => !current)}
          >
            <span />
          </button>
        </label>
        <label className="hero-slides-interval">
          <span>Interval (sec)</span>
          <input
            type="number"
            min={3}
            max={15}
            step={1}
            value={intervalSec}
            disabled={!autoplay}
            onChange={(event) => setIntervalSec(clampIntervalSec(Number(event.target.value)))}
          />
        </label>
        <input type="hidden" name="autoplay" value={autoplay ? "true" : "false"} />
        <input type="hidden" name="intervalMs" value={String(intervalSec * 1000)} />
      </div>

      <div className="hero-slide-editor-list">
        {slides.map((slide, index) => {
          const fieldPrefix = `slide${index + 1}`;

          return (
            <section className="hero-slide-editor-card" key={slide.editorId}>
              <header>
                <strong>슬라이드 {index + 1}</strong>
                {slides.length > 1 ? (
                  <button type="button" className="admin-text-button" onClick={() => removeSlide(index)}>
                    제거
                  </button>
                ) : null}
              </header>

              <input type="hidden" name={`${fieldPrefix}Id`} value={slide.id} />
              <input type="hidden" name={`${fieldPrefix}Eyebrow`} value={slide.eyebrow} />
              <input type="hidden" name={`${fieldPrefix}Heading`} value={slide.heading} />
              <input type="hidden" name={`${fieldPrefix}Line`} value={slide.line} />

              {slide.mediaUrl ? (
                slide.mediaType === "video" ? (
                  <video className="landing-media-preview" src={slide.mediaUrl} poster={slide.posterUrl || undefined} muted controls />
                ) : (
                  <div className="landing-media-preview" style={{ backgroundImage: `url("${slide.mediaUrl}")` }} />
                )
              ) : (
                <div className="landing-media-preview landing-media-preview-empty">미디어를 선택하거나 업로드하세요.</div>
              )}

              <div className="hero-slide-editor-fields">
                <label>
                  미디어 종류
                  <select
                    name={`${fieldPrefix}MediaType`}
                    value={slide.mediaType}
                    onChange={(event) => updateSlide(index, { mediaType: event.target.value === "video" ? "video" : "image" })}
                  >
                    <option value="image">이미지</option>
                    <option value="video">영상</option>
                  </select>
                </label>
                <label>
                  이미지/영상 주소
                  <input
                    name={`${fieldPrefix}MediaUrl`}
                    list="hero-slide-asset-options"
                    value={slide.mediaUrl}
                    onChange={(event) => updateSlide(index, { mediaUrl: event.target.value })}
                    placeholder="Files URL 또는 직접 주소"
                  />
                </label>
                {slide.mediaType === "video" ? (
                  <label>
                    영상 대체 이미지
                    <input
                      name={`${fieldPrefix}PosterUrl`}
                      list="hero-slide-asset-options"
                      value={slide.posterUrl}
                      onChange={(event) => updateSlide(index, { posterUrl: event.target.value })}
                      placeholder="영상 로딩 전 표시할 이미지"
                    />
                  </label>
                ) : (
                  <input type="hidden" name={`${fieldPrefix}PosterUrl`} value="" />
                )}
                <label>
                  대체 문구
                  <input
                    name={`${fieldPrefix}Alt`}
                    value={slide.alt}
                    onChange={(event) => updateSlide(index, { alt: event.target.value })}
                    placeholder="미디어 내용을 설명하는 문구"
                  />
                </label>
              </div>

              <label className="admin-upload-control">
                <span>파일 업로드</span>
                <em>Image JPG/PNG/WebP max 8MB. Video MP4/WebM max 25MB.</em>
                <input
                  name={`${fieldPrefix}File`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  disabled={!canPersist}
                />
              </label>
            </section>
          );
        })}
      </div>

      {slides.length < 5 ? (
        <button
          type="button"
          className="admin-secondary-button hero-slide-add-button"
          onClick={() =>
            setSlides((current) => [
              ...current,
              {
                ...createEmptySlide(current.length),
                editorId: `new-${current.length}-${current.length}`
              }
            ])
          }
        >
          슬라이드 추가
        </button>
      ) : null}

      <datalist id="hero-slide-asset-options">
        {assets.map((asset) => (
          <option key={asset.id} value={asset.public_url}>
            {asset.alt || asset.kind}
          </option>
        ))}
      </datalist>
    </aside>
  );
}

"use client";

// Footer 소셜 링크 배열을 추가·삭제하고 순서대로 직렬화하는 편집기
import React, { useState } from "react";

export const SOCIAL_PLATFORMS = ["instagram", "facebook", "tiktok", "youtube", "pinterest"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialLinkInput = {
  id: string;
  platform: SocialPlatform;
  href: string;
  label: string;
  visible: boolean;
};

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest"
};

const MAX_SOCIAL_LINKS = 8;

export function SocialLinksEditor({ initialLinks }: { initialLinks: SocialLinkInput[] }) {
  const [links, setLinks] = useState(initialLinks.slice(0, MAX_SOCIAL_LINKS));

  function updateLink(id: string, patch: Partial<SocialLinkInput>) {
    setLinks((current) => current.map((link) => (link.id === id ? { ...link, ...patch } : link)));
  }

  function addLink() {
    setLinks((current) => {
      if (current.length >= MAX_SOCIAL_LINKS) return current;

      return [
        ...current,
        {
          id: `social-${Date.now()}`,
          platform: "instagram",
          href: "",
          label: "",
          visible: true
        }
      ];
    });
  }

  return (
    <section className="admin-asset-panel social-links-editor">
      <input type="hidden" name="socialLinksManaged" value="true" />
      <div className="admin-section-heading">
        <span>소셜 링크</span>
        <small>
          {links.length} / {MAX_SOCIAL_LINKS}
        </small>
      </div>
      <p className="social-links-help">표시할 채널만 추가하고 URL을 입력하세요. 위에서부터 Footer에 표시됩니다.</p>
      <div className="social-links-list">
        {links.map((link, index) => {
          const prefix = `social${index + 1}`;

          return (
            <div className="social-link-row" key={link.id}>
              <input type="hidden" name={`${prefix}Id`} value={link.id} />
              <select
                aria-label={`소셜 링크 ${index + 1} 플랫폼`}
                name={`${prefix}Platform`}
                value={link.platform}
                onChange={(event) => updateLink(link.id, { platform: event.target.value as SocialPlatform })}
              >
                {SOCIAL_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platformLabels[platform]}
                  </option>
                ))}
              </select>
              <input
                aria-label={`소셜 링크 ${index + 1} URL`}
                name={`${prefix}Href`}
                type="url"
                value={link.href}
                placeholder="https://"
                onChange={(event) => updateLink(link.id, { href: event.target.value })}
              />
              <input
                aria-label={`소셜 링크 ${index + 1} 이름`}
                name={`${prefix}Label`}
                value={link.label}
                placeholder="표시 이름 (선택)"
                onChange={(event) => updateLink(link.id, { label: event.target.value })}
              />
              <label className="social-link-visible">
                <input
                  name={`${prefix}Visible`}
                  type="checkbox"
                  value="true"
                  checked={link.visible}
                  onChange={(event) => updateLink(link.id, { visible: event.target.checked })}
                />
                표시
              </label>
              <button className="admin-text-button" type="button" onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))}>
                제거
              </button>
            </div>
          );
        })}
      </div>
      <button className="admin-secondary-button social-link-add-button" type="button" onClick={addLink} disabled={links.length >= MAX_SOCIAL_LINKS}>
        소셜 링크 추가
      </button>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { assetKindOptions, type AssetKind } from "@/lib/asset-kinds";

type Asset = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  alt: string | null;
  kind: string;
  created_at: string;
  usage: Array<{ label: string; detail: string }>;
};

function fileName(path: string) {
  return path.split("/").pop() ?? path;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function AssetLibrary({
  assets,
  deleteAction
}: {
  assets: Asset[];
  deleteAction: (formData: FormData) => void | Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<AssetKind | "all">("all");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesKind = kind === "all" || asset.kind === kind;
      const isUsed = asset.usage.length > 0;
      const matchesUsage = usage === "all" || (usage === "used" ? isUsed : !isUsed);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [asset.path, asset.alt, asset.public_url, asset.kind, ...asset.usage.flatMap((item) => [item.label, item.detail])].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedQuery)
        );

      return matchesKind && matchesUsage && matchesQuery;
    });
  }, [assets, kind, query, usage]);

  const usedCount = assets.filter((asset) => asset.usage.length > 0).length;
  const unusedCount = assets.length - usedCount;

  async function copyUrl(asset: Asset) {
    await navigator.clipboard.writeText(asset.public_url);
    setCopiedId(asset.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  return (
    <section className="asset-library" aria-label="Asset library">
      <div className="asset-toolbar">
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search path, alt text, URL..."
          />
        </label>
        <label>
          Kind
          <select value={kind} onChange={(event) => setKind(event.target.value as AssetKind | "all")}>
            <option value="all">All files</option>
            {assetKindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Usage
          <select value={usage} onChange={(event) => setUsage(event.target.value as "all" | "used" | "unused")}>
            <option value="all">All usage</option>
            <option value="used">Used ({usedCount})</option>
            <option value="unused">Unused ({unusedCount})</option>
          </select>
        </label>
        <p>
          Showing <strong>{filteredAssets.length}</strong> of {assets.length}
        </p>
      </div>

      <div className="asset-grid">
        {filteredAssets.length === 0 ? (
          <p className="admin-empty">No matching files.</p>
        ) : (
          filteredAssets.map((asset) => {
            const isUsed = asset.usage.length > 0;

            return (
              <article className="asset-tile" key={asset.id}>
                <div
                  className="asset-thumb"
                  aria-label={asset.alt || fileName(asset.path)}
                  style={{ backgroundImage: `url("${asset.public_url}")` }}
                >
                  <span className={isUsed ? "asset-usage-badge used" : "asset-usage-badge"}>{isUsed ? "Used" : "Unused"}</span>
                </div>
                <div className="asset-tile-copy">
                  <div>
                    <span>{asset.kind}</span>
                    <small>{formatDate(asset.created_at)}</small>
                  </div>
                  <strong title={fileName(asset.path)}>{fileName(asset.path)}</strong>
                  <p title={asset.path}>{asset.path}</p>
                  <div className="asset-usage-list">
                    {isUsed ? (
                      asset.usage.map((item, index) => (
                        <span key={`${item.label}-${item.detail}-${index}`}>
                          {item.label} · {item.detail}
                        </span>
                      ))
                    ) : (
                      <span>Not connected to public content</span>
                    )}
                  </div>
                </div>
                <div className="asset-actions">
                  <a href={asset.public_url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <button type="button" onClick={() => copyUrl(asset)}>
                    {copiedId === asset.id ? "Copied" : "Copy URL"}
                  </button>
                  <form
                    action={deleteAction}
                    onSubmit={(event) => {
                      if (!window.confirm(`Delete ${fileName(asset.path)}? This cannot be undone.`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={asset.id} />
                    <button type="submit" disabled={isUsed} title={isUsed ? "Used files cannot be deleted." : "Delete unused file"}>
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

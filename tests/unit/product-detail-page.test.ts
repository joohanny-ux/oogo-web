import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const productDetailPage = readFileSync(
  join(process.cwd(), "src/app/products/[slug]/page.tsx"),
  "utf8"
);
const youngbinProjectPage = readFileSync(
  join(process.cwd(), "src/app/projects/youngbin-edition/page.tsx"),
  "utf8"
);

describe("public product detail page", () => {
  it("does not display image role labels inside the gallery", () => {
    expect(productDetailPage).not.toContain("<figcaption>");
  });
});

describe("Youngbin Edition project page", () => {
  it("links to the dedicated photo archive only from the closing profile", () => {
    expect(youngbinProjectPage).toContain(
      'const photoArchiveHref = withLocalePrefix("/archive/youngbin-edition", locale);'
    );
    expect(youngbinProjectPage).toContain("edition.profile.archiveLabel");
    expect(youngbinProjectPage).toContain(
      'className="youngbin-project-profile-actions"'
    );
    expect(youngbinProjectPage).not.toContain(
      'className="youngbin-project-actions"'
    );
    expect(youngbinProjectPage).toContain(
      'edition.profile.archiveHref || photoArchiveHref'
    );
  });
});

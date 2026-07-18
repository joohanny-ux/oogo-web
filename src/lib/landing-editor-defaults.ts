// 공개 페이지 fallback 문구를 언어별 Landing Editor 초기값으로 제공한다.
import type { Locale } from "@/lib/i18n";
import { getProductCatalogHref } from "@/lib/products";
import { pickLocaleCopy, publicCopy } from "@/lib/public-copy";
import { getFeaturedSpecialEdition } from "@/lib/special-editions";

type BlockDefaults = Record<string, string>;
type PageDefaults = Record<string, BlockDefaults>;

function localized(locale: Locale, copy: Record<Locale, string>) {
  return pickLocaleCopy(locale, copy);
}

export function getLandingEditorDefaultContent(pageKey: string, blockKey: string, locale: Locale): BlockDefaults {
  const edition = getFeaturedSpecialEdition();
  const brand = publicCopy.brand;
  const defaults: Record<string, PageDefaults> = {
    header: {
      main: {
        logoLabel: "OOGO",
        logoHref: "/",
        nav1Label: localized(locale, publicCopy.nav.brand),
        nav1Href: "/brand",
        nav2Label: localized(locale, publicCopy.nav.collection),
        nav2Href: getProductCatalogHref(),
        nav3Label: localized(locale, publicCopy.nav.projects),
        nav3Href: "/projects",
        nav4Label: localized(locale, publicCopy.nav.archive),
        nav4Href: "/archive",
        nav5Label: localized(locale, publicCopy.nav.inquiry),
        nav5Href: "/inquiry",
        showLocale: "true"
      }
    },
    home: {
      hero: {
        eyebrow: localized(locale, publicCopy.home.heroEyebrow),
        heading: localized(locale, publicCopy.home.heroHeading),
        line: localized(locale, publicCopy.home.heroLine)
      },
      "collection-preview": {
        eyebrow: localized(locale, publicCopy.home.collectionEyebrow),
        primaryLabel: localized(locale, publicCopy.common.viewAll),
        primaryHref: getProductCatalogHref()
      },
      "special-preview": {
        eyebrow: localized(locale, publicCopy.home.projectsEyebrow),
        heading: localized(locale, publicCopy.home.projectsHeading),
        body: localized(locale, publicCopy.home.projectsBody),
        primaryLabel: localized(locale, publicCopy.common.viewProject),
        primaryHref: "/projects/youngbin-edition"
      },
      "archive-preview": {
        eyebrow: localized(locale, publicCopy.home.archiveEyebrow),
        primaryLabel: localized(locale, publicCopy.common.viewArchive),
        primaryHref: "/archive"
      }
    },
    "brand-story": {
      "story-hero": {
        eyebrow: localized(locale, brand.eyebrow),
        heading: "OOGO",
        line: localized(locale, brand.lead),
        body: localized(locale, brand.heroBody)
      },
      about: {
        eyebrow: locale === "zh" ? "关于 OOGO" : "About OOGO",
        heading: localized(locale, brand.aboutHeading),
        body: localized(locale, brand.aboutBody),
        what: localized(locale, brand.what),
        who: localized(locale, brand.who),
        offer: localized(locale, brand.offer)
      },
      statement: {
        eyebrow: "Brand Statement",
        headline: localized(locale, brand.statementHeadline),
        body: localized(locale, brand.statementBody)
      },
      essence: {
        heading: localized(locale, brand.essenceHeading),
        item1Title: "QUIET",
        item2Title: "HUMAN",
        item3Title: "LIGHT",
        item4Title: "SHADOW",
        item5Title: "MEMORY",
        item6Title: "FRAME",
        ...Object.fromEntries(brand.essenceBodies.map((copy, index) => [`item${index + 1}Body`, localized(locale, copy)]))
      },
      philosophy: {
        heading: localized(locale, brand.philosophyHeading),
        item1Title: "Proportion",
        item2Title: "Balance",
        item3Title: "Comfort",
        item4Title: "Clarity",
        item5Title: "Timeless Form"
      },
      experience: {
        heading: localized(locale, brand.experienceHeading)
      },
      "closing-cta": {
        body: localized(locale, brand.closingBody),
        primaryLabel: localized(locale, publicCopy.common.viewCollection),
        primaryHref: getProductCatalogHref(),
        secondaryLabel: localized(locale, publicCopy.common.businessInquiry),
        secondaryHref: "/inquiry"
      }
    },
    collection: {
      "collection-hero": {
        eyebrow: localized(locale, publicCopy.collection.eyebrow),
        heading: localized(locale, publicCopy.collection.heading),
        body: localized(locale, publicCopy.collection.body)
      }
    },
    projects: {
      intro: {
        eyebrow: localized(locale, publicCopy.projects.eyebrow),
        heading: localized(locale, publicCopy.projects.heading),
        body: localized(locale, publicCopy.projects.body)
      },
      "featured-project": {
        year: edition.year,
        heading: edition.title,
        body: localized(locale, publicCopy.home.projectsBody),
        primaryHref: `/projects/${edition.slug}`
      },
      "collaboration-cta": {
        eyebrow: localized(locale, publicCopy.projects.next),
        heading: localized(locale, publicCopy.projects.openCollab),
        body: localized(locale, publicCopy.projects.openCollabBody),
        primaryHref: "/inquiry"
      }
    },
    "product-detail": {
      "detail-template": {
        buyerCta: localized(locale, publicCopy.product.buyerCta),
        buyerHref: "/inquiry"
      }
    },
    "special-edition": {
      "special-hero": {
        eyebrow: "OOGO x JI YOUNGBIN",
        heading: edition.title,
        subtitle: `${edition.year} · ${edition.collaborator}`,
        body: localized(locale, publicCopy.youngbin.heroBody)
      },
      "collaboration-statement": {
        statementEn: localized(locale, publicCopy.youngbin.statementHeadline),
        bodyKo: localized(locale, publicCopy.youngbin.storyBody)
      },
      "limited-edition": {
        eyebrow: localized(locale, publicCopy.youngbin.limitedEyebrow),
        heading: edition.limited.heading,
        feature1Title: localized(locale, publicCopy.youngbin.featureTitles[0]),
        feature2Title: localized(locale, publicCopy.youngbin.featureTitles[1]),
        feature3Title: localized(locale, publicCopy.youngbin.featureTitles[2])
      },
      "edition-gallery": {
        eyebrow: localized(locale, publicCopy.youngbin.campaignProduct),
        heading: localized(locale, publicCopy.youngbin.editionGallery)
      },
      "photographer-profile": {
        eyebrow: localized(locale, publicCopy.youngbin.profileEyebrow),
        name: edition.profile.name,
        role: localized(locale, publicCopy.youngbin.profileRole),
        quoteKo: edition.profile.quoteKo,
        quoteEn: locale === "ko" ? edition.profile.quoteEn : localized(locale, publicCopy.youngbin.quote),
        body: localized(locale, publicCopy.youngbin.profileBody),
        credential1: localized(locale, publicCopy.youngbin.credentials[0]),
        credential2: localized(locale, publicCopy.youngbin.credentials[1]),
        credential3: localized(locale, publicCopy.youngbin.credentials[2]),
        archiveLabel: localized(locale, publicCopy.youngbin.archiveLabel),
        archiveHref: edition.profile.archiveHref
      },
      "footer-cta": {
        primaryLabel: localized(locale, publicCopy.youngbin.buyerInquiry),
        primaryHref: "/inquiry"
      },
      "youngbin-archive": {
        eyebrow: localized(locale, publicCopy.archive.youngbinEdition),
        heading: localized(locale, publicCopy.archive.photoArchive),
        artistCredit: localized(locale, publicCopy.archive.artistCredit),
        body: localized(locale, publicCopy.archive.youngbinBody),
        projectLabel: localized(locale, publicCopy.common.viewProject)
      }
    },
    archive: {
      intro: {
        eyebrow: localized(locale, publicCopy.archive.eyebrow),
        heading: localized(locale, publicCopy.archive.heading),
        body: localized(locale, publicCopy.archive.body)
      }
    },
    inquiry: {
      "inquiry-main": {
        eyebrow: localized(locale, publicCopy.inquiry.eyebrow),
        heading: localized(locale, publicCopy.inquiry.heading),
        body: localized(locale, publicCopy.inquiry.body)
      },
      "direct-channel": {
        eyebrow: localized(locale, publicCopy.inquiry.direct),
        email: "contact@oogolaps.com",
        address: localized(locale, publicCopy.inquiry.address)
      },
      "topic-guide": Object.fromEntries(
        publicCopy.inquiry.topics.map((copy, index) => [`topic${index + 1}`, localized(locale, copy)])
      ),
      "response-note": {
        response: localized(locale, publicCopy.inquiry.response)
      }
    },
    footer: {
      brand: {
        brandDescription: localized(locale, publicCopy.home.footerBrand)
      },
      navigation: {
        nav1Label: localized(locale, publicCopy.nav.collection),
        nav1Href: getProductCatalogHref(),
        nav2Label: localized(locale, publicCopy.nav.projects),
        nav2Href: "/projects",
        nav3Label: localized(locale, publicCopy.nav.archive),
        nav3Href: "/archive",
        nav4Label: localized(locale, publicCopy.nav.inquiry),
        nav4Href: "/inquiry",
        nav5Label: localized(locale, publicCopy.common.brandStory),
        nav5Href: "/brand"
      },
      "contact-legal": {
        email: "contact@oogolaps.com",
        address: localized(locale, publicCopy.inquiry.address),
        termsLabel: localized(locale, publicCopy.common.terms),
        termsHref: "/terms-conditions",
        privacyLabel: localized(locale, publicCopy.common.privacy),
        privacyHref: "/privacy-policy",
        copyright: localized(locale, publicCopy.common.copyright)
      }
    }
  };

  return defaults[pageKey]?.[blockKey] ?? {};
}

export function getLandingEditorContent(
  pageKey: string,
  blockKey: string,
  locale: Locale,
  draftContent: Record<string, unknown> = {}
) {
  const defaults = getLandingEditorDefaultContent(pageKey, blockKey, locale);
  const content = {
    ...defaults,
    ...draftContent
  };

  for (const [key, fallback] of Object.entries(defaults)) {
    if (typeof draftContent[key] === "string" && !draftContent[key].trim()) {
      content[key] = fallback;
    }
  }

  return content;
}

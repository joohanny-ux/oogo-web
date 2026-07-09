// Archive subpage용 정적 이미지 그리드 데이터. 추후 admin asset/archive 테이블로 이전 예정.

export type ArchiveCategory = "campaign" | "product" | "wearing" | "space" | "detail";

export type ArchiveGridItem = {
  id: string;
  label: string;
  image: string;
  category: ArchiveCategory;
  position?: string;
};

const images = {
  gallery: "/images/oogo-gallery.png",
  hero: "/images/oogo-hero.png",
  angle: "/images/oogo-product-angle.png"
} as const;

export const archiveGridItems: ArchiveGridItem[] = [
  {
    id: "archive-01",
    label: "Campaign light",
    image: images.gallery,
    category: "campaign",
    position: "center"
  },
  {
    id: "archive-02",
    label: "Wearing cut",
    image: images.hero,
    category: "wearing",
    position: "58% center"
  },
  {
    id: "archive-03",
    label: "Studio space",
    image: images.gallery,
    category: "space",
    position: "42% center"
  },
  {
    id: "archive-04",
    label: "Face and light",
    image: images.hero,
    category: "wearing",
    position: "62% center"
  },
  {
    id: "archive-05",
    label: "Seasonal edit",
    image: images.gallery,
    category: "campaign",
    position: "48% center"
  },
  {
    id: "archive-06",
    label: "Quiet attitude",
    image: images.hero,
    category: "wearing",
    position: "center"
  },
  {
    id: "archive-07",
    label: "Shadow frame",
    image: images.gallery,
    category: "space",
    position: "36% center"
  },
  {
    id: "archive-08",
    label: "Frame detail",
    image: images.angle,
    category: "detail",
    position: "center"
  },
  {
    id: "archive-09",
    label: "Campaign note",
    image: images.hero,
    category: "campaign",
    position: "54% center"
  },
  {
    id: "archive-10",
    label: "Archive cut",
    image: images.gallery,
    category: "detail",
    position: "52% center"
  },
  {
    id: "archive-11",
    label: "Light study",
    image: images.hero,
    category: "space",
    position: "40% center"
  },
  {
    id: "archive-12",
    label: "Wearing note",
    image: images.gallery,
    category: "wearing",
    position: "66% center"
  }
];

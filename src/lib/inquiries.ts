import type { InquiryType } from "@/types/content";

const inquiryTypes: InquiryType[] = ["general", "buyer", "retail", "collaboration", "other", "press"];
const formInquiryTypes = ["buyer", "retail", "collaboration", "press"] as const;

export type InquiryFormType = (typeof formInquiryTypes)[number];

type InquiryInput = {
  type: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  country?: string;
  phone?: string;
  privacyConsent?: boolean;
};

export function mapInquiryFormType(type: string): InquiryType | null {
  if (inquiryTypes.includes(type as InquiryType)) {
    return type as InquiryType;
  }

  return null;
}

export function validateInquiryInput(
  input: InquiryInput
): { ok: true; value: InquiryInput & { type: InquiryType } } | { ok: false; message: string } {
  const mappedType = mapInquiryFormType(input.type);

  if (!mappedType) {
    return { ok: false, message: "문의 유형을 선택해 주세요." };
  }

  if (input.name.trim().length < 2) {
    return { ok: false, message: "이름을 입력해 주세요." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, message: "올바른 이메일을 입력해 주세요." };
  }

  if (input.message.trim().length < 10) {
    return { ok: false, message: "문의 내용은 10자 이상 입력해 주세요." };
  }

  if (!input.privacyConsent) {
    return { ok: false, message: "개인정보 수집 및 이용에 동의해 주세요." };
  }

  return { ok: true, value: { ...input, type: mappedType } };
}

// 요청 컨텍스트에서 공개 로케일 읽기
import { cookies, headers } from "next/headers";
import { isLocale, normalizeLocale, type Locale } from "@/lib/i18n";
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  LOCALE_PATH_HEADER,
  getPathLocale,
  localizedHrefForLocale,
  stripLocalePrefix,
  withLocalePrefix
} from "@/lib/locale-path";

export {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  LOCALE_PATH_HEADER,
  getPathLocale,
  localizedHrefForLocale,
  stripLocalePrefix,
  withLocalePrefix
};

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const headerLocale = headerStore.get(LOCALE_HEADER) ?? undefined;
  if (isLocale(headerLocale)) {
    return headerLocale;
  }

  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getRequestPathname(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get(LOCALE_PATH_HEADER) || "/";
}

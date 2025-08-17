import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix,
  });

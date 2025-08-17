import { notFound } from 'next/navigation.js';
import {
  getRequestConfig,
  type GetRequestConfigParams,
  type RequestConfig,
} from 'next-intl/server';
import { routing } from '../routing.ts';

const locales = routing.locales as readonly string[];

export default getRequestConfig(
  async (params: GetRequestConfigParams): Promise<RequestConfig> => {
    const { locale } = params;

    function assertValidLocale(l?: string): asserts l is string {
      if (!l || !locales.includes(l)) {
        notFound();
      }
    }

    assertValidLocale(locale);

    const messages = (await import(`../i18n/${locale}.json`)).default as Record<
      string,
      string
    >;

    return {
      locale,
      messages,
    };
  }
);

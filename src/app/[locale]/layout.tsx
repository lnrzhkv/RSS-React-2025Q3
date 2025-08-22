import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Providers from '@/shared/store/Providers';
import { ThemeProvider } from '@/context/ThemeContext';
import AppLayout from '@/components/AppLayout/AppLayout';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  let messages = {};

  try {
    messages = (await import(`@/shared/i18n/${locale}.json`)).default;
  } catch {
    console.warn(`No messages for "${locale}", falling back to English.`);
    messages = (await import(`@/shared/i18n/en.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}

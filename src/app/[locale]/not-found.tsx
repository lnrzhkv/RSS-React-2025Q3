import { NextIntlClientProvider } from 'next-intl';
import NotFoundPage from '@/components/NotFoundPage/NotFoundPage.tsx';
import messages from '@/shared/i18n/en.json' with { type: 'json' };

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider locale="en" messages={messages}>
          <NotFoundPage />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

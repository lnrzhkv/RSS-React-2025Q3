import React, {
  ReactNode,
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
} from 'react';
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

(global as unknown as Record<string, unknown>).TextEncoder =
  TextEncoder as unknown;
(global as unknown as Record<string, unknown>).TextDecoder =
  TextDecoder as unknown;

interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname?: string };
  children?: ReactNode;
}
type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

jest.mock('next/link', () => {
  return function Link({ href, children, ...rest }: LinkProps) {
    const url = typeof href === 'string' ? href : (href?.pathname ?? '');
    return React.createElement('a', { href: url, ...rest }, children);
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => React.createElement('img', props),
}));

jest.mock('next/font/google', () => ({
  __esModule: true,
  Inter: () => ({ className: 'font-inter' }),
}));

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(''),
  };
});

jest.mock('@/shared/lib/navigation.ts', () => {
  return {
    Link: ({ href, children, ...rest }: LinkProps) => {
      const url = typeof href === 'string' ? href : (href?.pathname ?? '');
      return React.createElement('a', { href: url, ...rest }, children);
    },
    usePathname: () => '/',
  };
});

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => {
    const dict: Record<string, string> = {
      home: 'Home',
      about: 'About',
      language: 'Language',
      switchToEn: 'EN',
      switchToRu: 'RU',
    };
    return (key: string) => dict[key] ?? key;
  },
}));

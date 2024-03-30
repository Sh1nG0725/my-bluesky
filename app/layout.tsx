import '@/app/ui/global.css';
import { notoSansJP } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My BlueSky',
    default: 'My BlueSky',
  },
  description: 'My BlueSky',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>{children}</body>
    </html>
  );
}

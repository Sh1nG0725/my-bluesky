import '@/app/ui/global.css';
import { notoSansJP } from '@/app/ui/fonts';
import { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './tproviders';

export const metadata: Metadata = {
  title: {
    template: '%s | My BlueSky',
    default: 'My BlueSky',
  },
  description: 'My BlueSky',
};

/**
 * 全体レイアウト
 * @param param0 
 * @returns レイアウト
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

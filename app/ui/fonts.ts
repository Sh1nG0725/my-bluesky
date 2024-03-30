import { Noto_Sans_JP } from 'next/font/google';
 
export const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] });

export const notoSansJP400  = Noto_Sans_JP({
    weight: ['400', '700'],
    subsets: ['latin'],
});
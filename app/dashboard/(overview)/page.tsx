import { FC, Suspense } from 'react';
import { Contents } from './content';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './providers';
import { Toast } from '@/app/ui/toast';

/**
 * ダッシューボードのページ全体
 * @returns ページ
 */
const Page: FC = () => {
  return (
    <Providers>
      <Contents />
      <Toast />
    </Providers>
  );
}

export default Page;
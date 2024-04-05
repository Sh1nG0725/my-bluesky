import LatestPosts from '@/app/ui/dashboard/latest-posts';
import { notoSansJP } from '@/app/ui/fonts';
import { FC, Suspense } from 'react';
import { LatestPostsSkeleton,CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { Contents } from './content';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './providers';

const Page: FC = () => {
  return (
    <Providers>
      <Contents />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Providers>
  );
}

export default Page;
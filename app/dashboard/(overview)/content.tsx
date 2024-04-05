import LatestPosts from '@/app/ui/dashboard/latest-posts';
import { notoSansJP } from '@/app/ui/fonts';
import { FC, Suspense } from 'react';
import { LatestPostsSkeleton,CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

export const Contents: FC = () => {
  console.log("Contents");
  return (
    <>
      <div className="flex mb-4 items-center">
        <PresentationChartBarIcon className="w-6 text-gray-700" />
        <h1 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700`}>
        Dashboard
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <LatestPosts />
        </Suspense>
      </div>
    </>
  );
}
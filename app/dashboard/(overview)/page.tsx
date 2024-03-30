import LatestPosts from '@/app/ui/dashboard/latest-posts';
import { notoSansJP } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { LatestPostsSkeleton,CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

export default async function Page() {
  return (
    <main>
      <h1 className={`${notoSansJP.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <LatestPosts />
        </Suspense>
      </div>
    </main>
  );
}
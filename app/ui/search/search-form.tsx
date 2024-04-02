import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { LatestPostsSkeleton } from '../skeletons';
import { Suspense, useState } from 'react';
import SearchPosts from '../dashboard/search-posts';
import { fetchFollowingPosts } from '@/app/lib/data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchButton from '../search-button';
import FormSub from './search-form-sub';

export default async function Form({
  query,
}: {
  query: string;
}) {
  return (
    <>
      <FormSub query={query} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <SearchPosts query={query}/>
        </Suspense>
      </div>
    </>
  );
}

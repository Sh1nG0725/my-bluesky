import { LatestPostsSkeleton } from '../skeletons';
import { Suspense, useState } from 'react';
import SearchPosts from './search-posts';
import FormSub from './search-form-sub';

export default async function Form({
  query,
}: {
  query: string;
}) {
  return (
    <>
      <FormSub query={query} />
      {query ? 
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <SearchPosts query={query}/>
        </Suspense>
      </div>
      : null}
    </>
  );
}

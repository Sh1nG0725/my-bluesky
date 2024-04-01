import LikesPosts from "@/app/ui/dashboard/likes-posts";
import { LatestPostsSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <LikesPosts />
        </Suspense>
      </div>
    </main>
  );
}
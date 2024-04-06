import FollowingPosts from "@/app/ui/following/following-posts";
import { LatestPostsSkeleton } from "@/app/ui/skeletons";
import { Toast } from "@/app/ui/toast";
import { Suspense } from "react";

/**
 * フォローイングポストのページ全体
 * @returns ページ
 */
export default async function Page() {
  return (
    <main>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestPostsSkeleton />}>
          <FollowingPosts />
          <Toast />
        </Suspense>
      </div>
    </main>
  );
}
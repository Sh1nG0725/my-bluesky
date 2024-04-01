'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { notoSansJP } from '@/app/ui/fonts';
import Link from 'next/link';
import { Like } from '../like';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LatestPost } from '@/app/lib/definitions';

type Props = {
  initialItems: LatestPost[];
  fetchFollowingPosts: (page?: number) => Promise<LatestPost[]>;
};

const sleep = (sec: number) => new Promise(resolve =>
  setTimeout(resolve, sec * 1000));

export function Posts({initialItems, fetchFollowingPosts} : Props) {

  const observerTarget = useRef(null);

  const [items, setItems] = useState([initialItems]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const flatItems = items.flatMap((page) => page);

  const loadMore = useCallback(
    async (page: number) => {
      await sleep(0.5);
      console.log(`page:${page}`);
      const data = await fetchFollowingPosts(page);
      console.log(`data:${data.length}`);
      setItems((prev) => [...prev, data]);

      const count = data.length;
      console.log(`count:${count}`);
      setHasMore(count > 0);
    },
    [fetchFollowingPosts]
  );
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            setPage((p) => p + 1);
          }
        });
      },
      { threshold: 1.0 }
    );

    let observerRefValue: null = null;

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
      observerRefValue = observerTarget.current;
    }

    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue);
    };
  }, [hasMore, observerTarget]);

  useEffect(() => {
    if (page > 0) loadMore(page);
  }, [page, loadMore]);
  
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${notoSansJP.className} mb-4 text-xl md:text-2xl`}>
        <strong>Following Posts</strong>
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}

        <div className="bg-white px-6">
          {flatItems.map((post, i) => {
            return (
              <div key={i}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-start">
                  <div style={{minWidth:'55px'}} className='mr-4'>
                    <Link
                      href={`https://bsky.app/profile/${post.handle}`}
                      className=""
                      target="_blank"
                    >
                      <Image
                        src={post.image_url}
                        alt={`${post.handle}'s profile picture`}
                        className="rounded-full"
                        width={50}
                        height={50}
                      />
                    </Link>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold md:text-base">{post.displayName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-sm text-gray-500">{`@${post.handle}`}</span>
                      <span className="ml-2 text-sm text-gray-500">{post.createdAt}</span>
                    </p>
                    <p className="text-sm md:text-base">
                      {post.text}
                    </p>
                    { post.embedImage ?
                      <div style={{minWidth:'55px'}} className='mr-4'>
                      <Link
                        href={post.embedImage}
                        className=""
                        target="_blank"
                      >
                        <Image
                          src={post.thumbImage}
                          alt={`${post.handle}'s embed picture`}
                          className=""
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '80%', height: 'auto' }}
                        />
                      </Link>
                      </div>
                    : null}
                    <div className="min-w-0">
                      <Like like={post.like} uri={post.uri} cid={post.cid}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div ref={observerTarget}>{hasMore && <div>Loading ...</div>}</div>
        </div>
      </div>
    </div>
  );
}

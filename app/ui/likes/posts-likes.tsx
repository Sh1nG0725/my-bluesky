'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { notoSansJP } from '@/app/ui/fonts';
import Link from 'next/link';
import { Like } from '../like';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LatestPost } from '@/app/lib/definitions';
import { HeartIcon, ArrowPathRoundedSquareIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import parse from 'html-react-parser'
import { replace } from '../link';
import { Repost } from '../repost';

type Props = {
  initialItems: LatestPost[];
  fetchLikePosts: (page?: number) => Promise<LatestPost[]>;
};

const sleep = (sec: number) => new Promise(resolve =>
  setTimeout(resolve, sec * 1000));

/**
 * いいねポストの内容
 * @param param0 
 * @returns 表示内容
 */
export function Posts({initialItems, fetchLikePosts} : Props) {

  const observerTarget = useRef(null);

  const [items, setItems] = useState([initialItems]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const flatItems = items.flatMap((page) => page);

  const loadMore = useCallback(
    async (page: number) => {
      await sleep(0.5);
      const data = await fetchLikePosts(page);
      setItems((prev) => [...prev, data]);
      const count = data.length;
      setHasMore(count > 0);
    },
    [fetchLikePosts]
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
      <div className="flex mb-4 items-center">
        <HeartIcon className="w-6 text-gray-700 dark:text-white" />
        <h1 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700 dark:text-white`}>
        Likes Posts
        </h1>
      </div>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white p-4">
        <div className="bg-white dark:bg-black px-6">
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
                <div className="flex items-start w-full">
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
                  <div className="min-w-0 w-full">
                    { post.reason ?
                    <p className="text-sm flex">
                      <ArrowPathRoundedSquareIcon className={`text-gray-500 w-4 h-4`} />
                      <span className="font-semibold text-xs text-gray-500">{post.reason}</span>
                    </p>
                    : null}
                    { post.reply ?
                    <p className="text-sm flex">
                      <ArrowUturnLeftIcon className={`text-gray-500 w-4 h-4`} />
                      <span className="font-semibold text-xs text-gray-500">{post.reply}</span>
                    </p>
                    : null}
                    <p className="text-sm">
                      <span className="font-semibold md:text-base">{post.displayName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-sm text-gray-500">{`@${post.handle}`}</span>
                      <span className="ml-2 text-sm text-gray-500">{post.createdAt}</span>
                    </p>
                    <p className="whitespace-pre-wrap text-sm md:text-base">
                      { parse(post.text, { replace }) }
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
                      <div className='float-left'><Like post={post} items={items} setItems={setItems}/></div>
                      <div className='float-right'><Repost post={post} items={items} setItems={setItems}/></div>
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

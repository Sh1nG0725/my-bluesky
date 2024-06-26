import clsx from 'clsx';
import Image from 'next/image';
import { notoSansJP } from '@/app/ui/fonts';
import { fetchLatestPosts } from '@/app/lib/data';
import Link from 'next/link';
import { ClockIcon, ArrowPathRoundedSquareIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import parse from 'html-react-parser'
import { replace } from '../link';

/**
 * 最近のポスト全体
 * @returns 表示内容
 */
export default async function LatestPosts() { 
  const latestPosts = await fetchLatestPosts();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex mb-4 items-center">
        <ClockIcon className="w-6 text-gray-700 dark:text-white" />
        <h2 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700 dark:text-white`}>
        Latest Your 5 Posts
        </h2>
      </div>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white p-4">
        <div className="bg-white dark:bg-black px-6">
          {latestPosts.map((post, i) => {
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

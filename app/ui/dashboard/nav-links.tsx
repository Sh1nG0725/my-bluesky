'use client';

import {
  HomeIcon,
  PencilSquareIcon,
  HeartIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

/**
 * リンクリスト
 */
const links = [
  {
    name: 'Home', 
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Post',
    href: '/dashboard/post',
    icon: PencilSquareIcon,
  },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Following',
    href: '/dashboard/following',
    icon: UserPlusIcon,
  },
  {
    name: 'Likes',
    href: '/dashboard/likes',
    icon: HeartIcon,
  },
];

/**
 * ナビゲーションリンクの全体
 * @returns 表示情報
 */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-300 dark:text-slate-500 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600 dark:bg-slate-700 dark:text-white': pathname === link.href,
              },
            )}
            >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

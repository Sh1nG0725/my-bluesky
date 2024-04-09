import MyBlueSkyLogo from '@/app/ui/mybluesky-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * トップページ
 * @returns トップページ
 */
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 dark:bg-slate-800 dark:text-white p-4 md:h-52">
        <MyBlueSkyLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20 dark:bg-slate-700">
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 dark:bg-slate-800 dark:text-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        
      </div>
    </main>
  );
}

import { notoSansJP } from '@/app/ui/fonts';
import Form from '@/app/ui/post/create-form';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

/**
 * 投稿のページ全体
 * @returns ページ
 */
export default async function Page() {
  return (
    <main>
      <div className="flex mb-4 items-center">
        <PencilSquareIcon className="w-6 text-gray-700 dark:text-white" />
        <h1 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700 dark:text-white`}>
          Post
        </h1>
      </div>
      <Form />
    </main>
  );
}
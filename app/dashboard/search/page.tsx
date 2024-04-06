import { notoSansJP } from '@/app/ui/fonts';
import Form from '@/app/ui/search/search-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * 検索のページ全体
 * @param param0 
 * @returns ページ
 */
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  return (
    <main>
      <div className="flex mb-4 items-center">
        <MagnifyingGlassIcon className="w-6 text-gray-700" />
        <h1 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700`}>
          Search Users
        </h1>
      </div>
      <Form query={query}/>
    </main>
  );
}
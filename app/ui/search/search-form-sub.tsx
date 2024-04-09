'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchButton from './search-button';
import { useState } from 'react';

export default function FormSub({
  query,
}: {
  query?: string;
}) {
  const [searchText, setSearchText] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    handleClick();
  }

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  async function handleClick() {
    console.log(`Searching... ${searchText}`);

    const params = new URLSearchParams(searchParams);
    if (searchText) {
      params.set('query', searchText);
    }
    window.location.href = `${pathname}?${params.toString()}`
  }
  return (
    <>
      <div className="rounded-md bg-gray-50 dark:bg-slate-700 dark:text-white p-4 md:p-6">
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500 dark:bg-black dark:placeholder:text-white"
                id="seachText"
                type="text"
                name="seachText"
                placeholder="検索"
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                defaultValue={query}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

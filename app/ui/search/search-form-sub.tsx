'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchButton from '../search-button';
import { useState } from 'react';

export default function FormSub({
  query,
}: {
  query: string;
}) {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="seachText"
                type="text"
                name="seachText"
                placeholder="検索"
                onChange={(e) => setSearchText(e.target.value)} 
              />
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <SearchButton searchText={searchText}/>
      </div>
    </>
  );
}

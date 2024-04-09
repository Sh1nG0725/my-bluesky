'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../button";

export default function SearchButton({
  searchText,
}: {
  searchText: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  async function handleClick() {
    console.log(`Searching... ${searchText}`);

    const params = new URLSearchParams(searchParams);
    if (searchText) {
      params.set('query', searchText);
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <Button type="submit" onClick={handleClick}>Search</Button>
  );
}

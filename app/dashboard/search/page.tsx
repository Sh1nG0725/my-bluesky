import Form from '@/app/ui/search/search-form';

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
      <Form query={query}/>
    </main>
  );
}
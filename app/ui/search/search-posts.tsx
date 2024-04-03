import { fetchSearchPosts } from '@/app/lib/data';
import { Posts } from './posts-search';

export default async function SearchPosts({
  query,
}: {
  query: string;
}) {
  const followingPosts = await fetchSearchPosts(0, query);
  return <Posts initialItems={followingPosts} fetchSearchPosts={fetchSearchPosts} />;
}

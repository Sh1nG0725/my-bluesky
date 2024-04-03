import { fetchLikePosts } from '@/app/lib/data';
import { Posts } from './posts-likes';

export default async function LikesPosts() { 
  const fetchLikesPosts = await fetchLikePosts(0);
  return <Posts initialItems={fetchLikesPosts} fetchLikePosts={fetchLikePosts} />;
}

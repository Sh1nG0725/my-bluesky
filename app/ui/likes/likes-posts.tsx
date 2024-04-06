import { fetchLikePosts } from '@/app/lib/data';
import { Posts } from './posts-likes';

/**
 * いいねポストの全体
 * @returns 表示内容
 */
export default async function LikesPosts() { 
  const fetchLikesPosts = await fetchLikePosts(0);
  return <Posts initialItems={fetchLikesPosts} fetchLikePosts={fetchLikePosts} />;
}

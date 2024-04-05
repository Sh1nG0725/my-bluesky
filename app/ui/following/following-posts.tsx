import { fetchFollowingPosts } from '@/app/lib/data';
import { Posts } from './posts-following';

export default async function FollowingPosts() { 
  const followingPosts = await fetchFollowingPosts(0);
  return <Posts initialItems={followingPosts} fetchFollowingPosts={fetchFollowingPosts} />;
}

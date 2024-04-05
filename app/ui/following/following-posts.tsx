import { fetchFollowingPosts } from '@/app/lib/data';
import { Posts } from './posts-following';

async function fetch() {
  "use server"
  return await fetchFollowingPosts(0);
}

export default async function FollowingPosts() { 
  const followingPosts = await fetch();
  return <Posts initialItems={followingPosts} fetchFollowingPosts={fetchFollowingPosts} />;
}

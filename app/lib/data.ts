import { LatestPost } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { agent } from '@/app/lib/api';
import { auth } from '@/auth';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';

export async function fetchLatestPosts() {
  noStore();
  try {
    // TODO:別コンポーネントのログイン状態をキープできない・・
    // if (agent.hasSession) {
    //   console.log("セッションあり");
    // } else {
    //   console.log("セッションなしのため再ログイン");
    //   const session = await auth();
    //   await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });
    // }
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    // const tl = await agent.getTimeline({ limit : 5 });
    const tl = await agent.getAuthorFeed({ actor : session?.user.id || "" });
    const feed = tl.data.feed;
    
    const latestPosts = [];
    for (const [key, value] of Object.entries(feed)) {
      let text = "";
      let createdAt = "";
      for (const [key, val] of Object.entries(value.post.record)) {
        if (key === "text") {
          text = val as string;
        } else if (key === "createdAt") {
          createdAt = val as string;
        }
      }

      const images = value.post.embed?.images as ViewImage[];
      const latestPost : LatestPost = {
        image_url: value.post.author.avatar || "",
        displayName: value.post.author.displayName || "",
        handle: value.post.author.handle || "",
        text: text || "",
        createdAt: new Date(createdAt).toLocaleString(),
        embedImage: (images && images.length !== 0) ? images[0].fullsize || "" : "",
        thumbImage: (images && images.length !== 0) ? images[0].thumb || "" : "",
      };
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    const followers = await agent.getFollowers({ actor: agent.session?.did || "" });
    const followersList = followers.data.followers;
    
    const follows = await agent.getFollows({ actor: agent.session?.did || "" });
    const followsList = follows.data.follows;

    const { data } = await agent.getProfile({ actor: agent.session?.did || "" });
    
    const numberOfFollowers = followersList.length;
    const numberOfFollowing = followsList.length;
    const numberofPost = data.postsCount as number;

    return {
      numberOfFollowers,
      numberOfFollowing,
      numberofPost,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFollowingPosts() {
  noStore();
  try {
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    const tl = await agent.getTimeline({ limit : 15});
    const feed = tl.data.feed;
    
    const latestPosts = [];
    for (const [key, value] of Object.entries(feed)) {
      let text = "";
      let createdAt = "";
      for (const [key, val] of Object.entries(value.post.record)) {
        if (key === "text") {
          text = val as string;
        } else if (key === "createdAt") {
          createdAt = val as string;
        }
      }

      const images = value.post.embed?.images as ViewImage[];
      const latestPost : LatestPost = {
        image_url: value.post.author.avatar || "",
        displayName: value.post.author.displayName || "",
        handle: value.post.author.handle || "",
        text: text || "",
        createdAt: new Date(createdAt).toLocaleString(),
        embedImage: (images && images.length !== 0) ? images[0].fullsize || "" : "",
        thumbImage: (images && images.length !== 0) ? images[0].thumb || "" : "",
      };
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest posts.');
  }
}
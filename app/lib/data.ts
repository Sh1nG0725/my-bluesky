import { LatestPost } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { agent } from '@/app/lib/api';
import { auth } from '@/auth';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

export async function fetchCardData() {
  noStore();
  try {
    // 認証
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    // フォロワー数を取得
    const followers = await agent.getFollowers({ actor: agent.session?.did || "" });
    const followersList = followers.data.followers;
    // フォロー数を取得
    const follows = await agent.getFollows({ actor: agent.session?.did || "" });
    const followsList = follows.data.follows;
    // プロフィールを取得
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

    // 認証
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    // 自分のポストを取得
    const tl = await agent.getAuthorFeed({ actor : session?.user.id || "", limit : 5 });
    const latestPosts = [];
    for (const [key, value] of Object.entries(tl.data.feed)) {
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
        like: (value.post.viewer && value.post.viewer.like) ? value.post.viewer.like : "",
        uri: value.post.uri,
        cid: value.post.cid,
      };
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

let followingFeed : FeedViewPost[] = [];
export async function fetchFollowingPosts(page: number = 0) {
  "use server"

  noStore();
  try {
    let feed : FeedViewPost[] = [];
    if (page == 0) {
      // 認証
      const session = await auth();
      await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

      // ライムライン取得
      const tl = await agent.getTimeline({ limit : 100 });
      followingFeed = tl.data.feed.slice();
    }

    const latestPosts : LatestPost[] = [];
    for (const [key, value] of Object.entries(followingFeed)) {
      if (!(Number(key) >= page*5 && Number(key) <= (page*5 + 4))) continue;

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
        like: (value.post.viewer && value.post.viewer.like) ? value.post.viewer.like : "",
        uri: value.post.uri,
        cid: value.post.cid,
      };
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

export async function fetchLikePosts() {
  noStore();
  try {
    // 認証
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });

    // いいねしたポストを取得
    const tl = await agent.getActorLikes({ actor : session?.user.id || "", limit : 10 });
    const latestPosts = [];
    for (const [key, value] of Object.entries(tl.data.feed)) {
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
      const likePost : LatestPost = {
        image_url: value.post.author.avatar || "",
        displayName: value.post.author.displayName || "",
        handle: value.post.author.handle || "",
        text: text || "",
        createdAt: new Date(createdAt).toLocaleString(),
        embedImage: (images && images.length !== 0) ? images[0].fullsize || "" : "",
        thumbImage: (images && images.length !== 0) ? images[0].thumb || "" : "",
        like: (value.post.viewer && value.post.viewer.like) ? value.post.viewer.like : "",
        uri: value.post.uri,
        cid: value.post.cid,
      };
      latestPosts.push(likePost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}
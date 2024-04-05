import { Actor, LatestPost } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { login } from '@/app/lib/api';
import { auth } from '@/auth';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

function autoMention(str: string, did: string) {
  const regexp_url = /@[a-zA-Z0-9-]+\.bsky\.social/g;
  var regexp_makeLink = function(url:string) {
      return '<a href="https://bsky.app/profile/' + did + '" target="_blank" rel="noopener">' + url + '</a>';
  }
  if (str.match(regexp_url) != null) {
      const urlAllMatches = str.match(regexp_url);
      if(urlAllMatches){
          const urlMatches = new Set(urlAllMatches);
          urlMatches.forEach(url => {
              str = str.replaceAll(url, regexp_makeLink(url));
          });
      }
  }
  return str;
}

function autoLink(str:string) {
  const regexp_url = /(https?|ftp):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3001-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
  var regexp_makeLink = function(url:string) {
      return '<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>';
  }
  if (str.match(regexp_url) != null) {
      const urlAllMatches = str.match(regexp_url);
      if(urlAllMatches){
          const urlMatches = new Set(urlAllMatches);
          urlMatches.forEach(url => {
              str = str.replaceAll(url, regexp_makeLink(url));
          });
      }
  }
  return str;
}

export async function fetchCardData() {
  noStore();
  try {
    const session = await auth();
    // 認証
    const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
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

type RecordObj = {
  '$type': string,
  createdAt: string,
  facets: [FacetsObj1, FacetsObj2],
  text: string
}
type FacetsObj1 = {
  '$type': string,
  features: [ [Object] ],
  index: { byteEnd: number, byteStart: number }
}
type FacetsObj2 = { 
  features: [ [Object] ], 
  index: { byteEnd: number, byteStart: number }
}

export async function fetchLatestPosts() {
  noStore();
  try {
    const session = await auth();
    // 認証
    const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
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
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

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
      const session = await auth();
      // 認証
      const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
      // タイムライン取得
      const tl = await agent.getTimeline({ limit : 100 });
      followingFeed = tl.data.feed.concat();
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
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

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

let likesFeed : FeedViewPost[] = [];
export async function fetchLikePosts(page: number = 0) {
  "use server"

  noStore();
  try {
    let feed : FeedViewPost[] = [];
    if (page == 0) {
      const session = await auth();
      // 認証
      const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
      // いいねしたポストを取得
      const tl = await agent.getActorLikes({ actor : session?.user.id || "", limit : 100 });
      likesFeed = tl.data.feed.concat();
    }

    const latestPosts : LatestPost[] = [];
    for (const [key, value] of Object.entries(likesFeed)) {
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
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

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

let searchActors : ProfileView[] = [];
export async function fetchSearchUsers(page: number = 0, query: string = "") {
  "use server"

  noStore();
  try {
    let feed : FeedViewPost[] = [];
    if (page == 0) {
      const session = await auth();
      // 認証
      const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
      // タイムライン取得
      if (query) {
        const res = await agent.searchActors({ limit : 100, q : query });
        searchActors = res.data.actors.concat();
        console.log(searchActors);
      } else {
        const res = await agent.getSuggestions({ limit : 100 });
        searchActors = res.data.actors.concat();
        console.log(searchActors);
      }
    }

    const actors : Actor[] = [];
    for (const [key, value] of Object.entries(searchActors)) {
      if (!(Number(key) >= page*5 && Number(key) <= (page*5 + 4))) continue;

      const actor : Actor = {
        image_url: value.avatar || "",
        displayName: value.displayName || "",
        handle: value.handle || "",
        description: value.description || "",
      };
      actors.push(actor);
    }

    return actors;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}
import { Actor, LatestPost } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { login } from '@/app/lib/api';
import { auth } from '@/auth';
import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { ProfileView, ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

type Record = {
  text: string;
  createdAt: string;
}
type By = {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}
type Profile = {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

/**
 * Feed内容の解析
 * @param feed 
 * @returns 解析結果
 */
function analysisFeed(feed: FeedViewPost) {
  let text = "";
  let createdAt = "";
  if (feed.post.record) {
    const record = feed.post.record as Record;
    text = record.text;
    createdAt = record.createdAt
  }
  let reason = "";
  if (feed.reason) {
    if (feed.reason.$type === "app.bsky.feed.defs#reasonRepost") {
      const by = feed.reason.by as By;
      reason = `${by.displayName}によるリポスト`;
    }
  }
  let reply = "";
  if (feed.reply) {
    const author = feed.reply.parent.author as ProfileViewBasic;
    reply = `${author.displayName}に返信`;
  }

  return {
    text,
    createdAt,
    reason,
    reply
  };
}

/**
 * ポスト情報作成
 * @param feed 
 * @param text 
 * @param createdAt 
 * @param reason 
 * @param reply 
 * @returns ポスト情報
 */
function createPost(feed: FeedViewPost, text: string, createdAt: string, reason: string, reply: string) {
  const images = feed.post.embed?.images as ViewImage[];
  const post : LatestPost = {
    image_url: feed.post.author.avatar || "",
    displayName: feed.post.author.displayName || "",
    handle: feed.post.author.handle || "",
    text: text || "",
    createdAt: new Date(createdAt).toLocaleString(),
    embedImage: (images && images.length !== 0) ? images[0].fullsize || "" : "",
    thumbImage: (images && images.length !== 0) ? images[0].thumb || "" : "",
    like: (feed.post.viewer && feed.post.viewer.like) ? feed.post.viewer.like : "",
    repost: (feed.post.viewer && feed.post.viewer.repost) ? feed.post.viewer.repost : "",
    uri: feed.post.uri,
    cid: feed.post.cid,
    reason: reason,
    reply: reply,
  };
  return post;
}

/**
 * メンションの解析
 * @param str 
 * @param did 
 * @returns 解析結果
 */
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

/**
 * リンクの解析
 * @param str 
 * @returns 解析結果
 */
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

/**
 * カードデータの取得
 * @returns 取得結果
 */
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

/**
 * 最近のポストの取得
 * @returns 取得結果
 */
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
      // Feed解析
      let { text, createdAt, reason, reply } = analysisFeed(value);
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

      // ポスト情報作成
      const latestPost = createPost(value, text, createdAt, reason, reply);
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

let followingFeed : FeedViewPost[] = [];
/**
 * フォローイングのポストの取得
 * @param page 
 * @returns 取得結果
 */
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
      console.log(`followingFeed:${followingFeed.length}`);
    }

    const latestPosts : LatestPost[] = [];
    for (const [key, value] of Object.entries(followingFeed)) {
      if (!(Number(key) >= page*5 && Number(key) <= (page*5 + 4))) continue;
      // Feed解析
      let { text, createdAt, reason, reply } = analysisFeed(value);
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

      // ポスト情報作成
      const latestPost = createPost(value, text, createdAt, reason, reply);
      latestPosts.push(latestPost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

let likesFeed : FeedViewPost[] = [];
/**
 * いいねポストの取得
 * @param page 
 * @returns 取得結果
 */
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
      console.log(`likesFeed:${likesFeed.length}`);
    }

    const latestPosts : LatestPost[] = [];
    for (const [key, value] of Object.entries(likesFeed)) {
      if (!(Number(key) >= page*5 && Number(key) <= (page*5 + 4))) continue;
      // Feed解析
      let { text, createdAt, reason, reply } = analysisFeed(value);
      if (text) text = autoLink(text);
      if (text) text = autoMention(text, value.post.author.did);

      // ポスト情報作成
      const likePost = createPost(value, text, createdAt, reason, reply);
      latestPosts.push(likePost);
    }

    return latestPosts;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch the latest posts.');
  }
}

let searchActors : ProfileView[] = [];
/**
 * ユーザーの検索
 * @param page 
 * @param query 
 * @returns 検索結果
 */
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
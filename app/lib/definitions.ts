/**
 * ユーザー
 */
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  image_url: string;
  app_password: string;
  displayName: string;
  handle: string;
};

/**
 * ポスト
 */
export type LatestPost = {
  image_url: string;
  displayName: string;
  handle: string;
  text: string;
  createdAt: string;
  embedImage: string;
  thumbImage: string;
  like: string;
  repost: string;
  uri: string;
  cid: string;
};

/**
 * アクター
 */
export type Actor = {
  image_url: string;
  displayName: string;
  handle: string;
  description: string;
};

"use server";

import { auth } from "@/auth";
import { login } from "./api";

/**
 * いいねクリックアクション
 * @param like 
 * @param uri 
 * @param cid 
 * @returns 実行結果
 */
export async function likeClick(like: string, uri: string, cid: string) {
  try {
    const session = await auth();
    // 認証
    const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
    if (!like) {
      return agent.like(uri, cid);
    } else {
      return agent.deleteLike(like);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to like posts.');
  }
}
"use server";

import { auth } from "@/auth";
import { login } from "./api";

/**
 * リポストクリックアクション
 * @param repost 
 * @param uri 
 * @param cid 
 * @returns 実行結果
 */
export async function repostClick(repost: string, uri: string, cid: string) {
  try {
    const session = await auth();
    // 認証
    const agent = await login(session?.user?.email || "", session?.user?.app_password || "");
    if (!repost) {
      return agent.repost(uri, cid);
    } else {
      return agent.deleteRepost(repost);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to repost posts.');
  }
}
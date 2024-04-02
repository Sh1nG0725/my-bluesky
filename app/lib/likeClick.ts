"use server";

import { auth } from "@/auth";
import { agent } from "./api";

export async function likeClick(like: string, uri: string, cid: string) {
  try {
    const session = await auth();
    await agent.login({ identifier: session?.user?.email || "", password: session?.user?.app_password || "" });
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
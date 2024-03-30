import { BskyAgent, AtpSessionEvent, AtpSessionData } from "@atproto/api";

export const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
    // store the session-data for reuse
  },
});

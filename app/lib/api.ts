import { AtpSessionData, AtpSessionEvent, BskyAgent } from "@atproto/api";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { config } from 'dotenv';
config();

let savedSessionData: AtpSessionData;
export const agent = new BskyAgent({
  service: 'https://bsky.social',
  persistSession: (evt: AtpSessionEvent, sesh?: AtpSessionData) => {
    if (!sesh) {
      throw new Error('No session data to persist. Did ya pass an incorrect username/password?');
    }
    // store the session-data for reuse
    savedSessionData = sesh;
    // ! Uncomment this line to save the session data to disk. Beware that this is a sensitive file!
    writeFile(process.env.SESSION_SAVE_PATH as string, JSON.stringify(sesh));
  }
})

export async function loginTop(identifier: string, password: string) {
  console.log(`Top Logging in...`);
  //await deleteToken();
  await agent.login({
    identifier: identifier,
    password: password
  })
  return agent;
}

async function deleteToken() {
  if (savedSessionData) {
    //リクエストエンドポイント
    let endpoint = "https://bsky.social/xrpc/com.atproto.server.deleteSession";
    const result = await fetch(endpoint, {
      headers: {
        Authorization: "Bearer " + savedSessionData.refreshJwt
      }
    })
  }
}

export async function login(identifier: string, password: string) {
  // If already logged in, resume session
  if (agent.session) {
    console.log('Already logged in...');
    return agent;
  }
  console.log(`Logging in...`);
  // See if we have saved session data
  const sesh = await readFile(process.env.SESSION_SAVE_PATH as string, { encoding: 'utf-8' }).catch(() => null);
  if (sesh) {
    console.log('Found saved session data. Resuming session...');
    savedSessionData = JSON.parse(sesh);
    await agent.resumeSession(savedSessionData)
  }
  else {
    console.log('No saved session data. Logging in...');
    await agent.login({
      identifier: identifier,
      password: password
    })
  }
  return agent;
}

import { BskyAgent } from "@atproto/api";

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  image_url: string;
  app_password: string;
  displayName: string;
  handle: string;
  agent: BskyAgent;
};

export type LatestPost = {
  image_url: string;
  displayName: string;
  handle: string;
  text: string;
  createdAt: string;
  embedImage: string;
  thumbImage: string;
};

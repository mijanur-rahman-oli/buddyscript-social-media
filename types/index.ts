// types/index.ts
import { Visibility } from "@prisma/client";

export type { Visibility };

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
}

export interface CommentWithReplies {
  id: string;
  text: string;
  createdAt: Date;
  author: UserSummary;
  postId: string;
  parentId: string | null;
  replies: CommentWithReplies[];
  likes: { userId: string }[];
  _count: { likes: number };
}

export interface PostWithDetails {
  id: string;
  text: string | null;
  imagePath: string | null;
  visibility: Visibility;
  createdAt: Date;
  author: UserSummary;
  comments: CommentWithReplies[];
  likes: { userId: string }[];
  _count: {
    comments: number;
    likes: number;
  };
}

export interface FeedResult {
  posts: PostWithDetails[];
  nextCursor: string | null;
  hasMore: boolean;
}
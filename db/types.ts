import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Comment = {
  id: Generated<number>;
  content: string;
  createdAt: Generated<Timestamp>;
  userId: number;
  postId: number;
};
export type Follow = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  followerId: number;
  followingId: number;
  userId: number | null;
};
export type Like = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  userId: number;
  postId: number;
};
export type Post = {
  id: Generated<number>;
  content: string;
  createdAt: Generated<Timestamp>;
  userId: number;
};
export type User = {
  id: Generated<number>;
  username: string;
  email: string;
  password: string;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  Comment: Comment;
  Follow: Follow;
  Like: Like;
  Post: Post;
  User: User;
};

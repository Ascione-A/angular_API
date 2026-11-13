export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  createdLocally?: boolean;
}

export type NewPost = Pick<Post, 'userId' | 'title' | 'body'>;

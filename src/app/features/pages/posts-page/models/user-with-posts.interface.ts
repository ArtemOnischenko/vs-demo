export interface User {
    id: number;
    name: string;
}
export interface UserWithPosts extends User {
    posts: Post[];
}
export interface Post {
    id: number;
    title: string;
    postBody: string;
    comments: Comment[];
    date: number;
}
export interface Comment {
    id: number;
    commentBody: string;
    userName: string;
}
export interface PostWithUser extends Post {
    userId: number;
    userName: string;
}
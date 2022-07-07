export interface ImgType {
  png: string;
  webp: string;
}

export interface UserType {
  image: ImgType;
  username: string;
}

export interface BaseCommentType {
  id: number;
  position: number;
  content: string;
  createdAt: string;
  createdAtDate: Date;
  score: number;
  user: UserType;
  replies: ReplyCommentType[];
}

export interface ReplyCommentType extends BaseCommentType {
  replyingTo: string;
}

export interface CommentDataType {
  currentUser: UserType;
  comments: CommentType[];
}

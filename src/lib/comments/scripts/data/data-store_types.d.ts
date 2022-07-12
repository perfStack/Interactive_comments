export interface ImgType {
  png: string;
  webp: string;
}

export interface UserType {
  image: ImgType;
  username: string;
}

interface BaseCommentType {
  id: number;
  position: number;
  isDeleted: boolean;
  content: string;
  createdAt: string;
  createdAtDate: Date;
  score: number;
  user: UserType;
  replies: ReplyCommentType[];
}

interface ReplyCommentType extends BaseCommentType {
  replyingTo: string;
}

interface CommentDataType {
  currentUser: UserType;
  comments: CommentType[];
}

export type { ImgType, UserType, BaseCommentType, ReplyCommentType, CommentDataType };

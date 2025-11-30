export interface Icategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  comments: Icomment[];
}

export interface Icomment {
  userId: string;
  comment: string;
  userName: string;
  createdAt: string;
  userImage: string;
  _id: string;
  updatedAt: string;
}

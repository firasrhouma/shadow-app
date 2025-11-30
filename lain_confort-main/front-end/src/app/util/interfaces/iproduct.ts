export interface Iproduct {
  sold: number;
  images: string[];
  image: string;
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  isWachList?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
export interface DecodedToken {
  role: string;
  userID: string;
  userName: string;
  [key: string]: any;
  avatar: string;
}

export interface ProductComment {
  productId: string;
  comments: Comment[];
}
export interface Comment {
  userId: string;
  comment: string;
  userName?: string;
  createdAt: Date;
  userImage?: string;
}

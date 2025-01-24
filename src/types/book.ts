export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  image: string;
}

export interface Category {
  name: string;
  color: string;
}
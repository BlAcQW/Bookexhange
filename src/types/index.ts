export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category_id: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  price: number;
  image_url?: string;
  owner_id: string;
  available: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface BorrowRequest {
  id: string;
  book_id: string;
  borrower_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  request_date: string;
  return_date?: string;
  created_at: string;
}
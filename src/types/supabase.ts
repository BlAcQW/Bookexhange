export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string | null
          category_id: string
          condition: string
          price: number
          image_url: string | null
          owner_id: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description?: string | null
          category_id: string
          condition: string
          price: number
          image_url?: string | null
          owner_id: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string | null
          category_id?: string
          condition?: string
          price?: number
          image_url?: string | null
          owner_id?: string
          available?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      borrow_requests: {
        Row: {
          id: string
          book_id: string
          borrower_id: string
          status: string
          request_date: string
          return_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          borrower_id: string
          status: string
          request_date?: string
          return_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          borrower_id?: string
          status?: string
          request_date?: string
          return_date?: string | null
          created_at?: string
        }
      }
    }
  }
}
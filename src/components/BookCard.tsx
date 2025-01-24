import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img src={book.image} alt={book.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-bold">GH₵ {book.price}</span>
          <span className="text-sm text-gray-500">{book.condition}</span>
        </div>
        <div className="mt-4">
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
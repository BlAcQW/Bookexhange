import { featuredBooks } from '../../data/books';

export function BookList() {
  const userBooks = featuredBooks.slice(0, 3); // Simulate user's books

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userBooks.map((book) => (
        <div key={book.id} className="bg-gray-50 rounded-lg p-4 flex gap-4">
          <img
            src={book.image}
            alt={book.title}
            className="w-24 h-24 object-cover rounded-md"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-red-600 font-semibold mt-2">GH₵ {book.price}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
              {book.condition}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
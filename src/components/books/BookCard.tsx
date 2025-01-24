import { useNavigate } from 'react-router-dom';
import { Book, MessageCircle, Edit, Trash2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { PaymentModal } from '../ui/PaymentModal';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    description?: string;
    category: string;
    condition: string;
    price: number;
    image_url: string;
    created_at: string;
    owner_id: string;
    available: boolean;
    profiles?: {
      id: string;
      name: string;
      avatar_url?: string;
      role?: string;
    };
  };
  onDelete?: () => void;
  onEdit?: () => void;
}

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const isOwner = user?.id === book.owner_id;

  const formattedDate = new Date(book.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { returnTo: `/books/${book.id}` } });
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Optionally refresh the book data or show a success message
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/books/${book.id}`)}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <motion.img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
            {book.category}
          </div>
          {!book.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SOLD</span>
            </div>
          )}
        </div>

        <motion.div 
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {book.profiles?.avatar_url ? (
                <img 
                  src={book.profiles.avatar_url}
                  alt={book.profiles.name}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50&h=50&fit=crop';
                  }}
                />
              ) : (
                <Book className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {book.profiles?.name || 'Anonymous'}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-2xl font-bold text-primary dark:text-primary-light">
                GH₵{book.price.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                • {book.condition}
              </span>
            </motion.div>
            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <motion.button 
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary-light/10 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={handleEdit}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/10 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    onClick={handleDelete}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </>
              ) : book.available && (
                <motion.button 
                  className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                  onClick={handleBuy}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DollarSign className="w-5 h-5" />
                </motion.button>
              )}
              <motion.button 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary-light/10 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/books/${book.id}?chat=true`);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookId={book.id}
        bookTitle={book.title}
        price={book.price}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
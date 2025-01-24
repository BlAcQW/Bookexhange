import { Search } from 'lucide-react';
import { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search by title, author, or ISBN...",
  onSubmit 
}: SearchBarProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <motion.div 
      className="max-w-xl mx-auto relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-10 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light border border-gray-300 dark:border-gray-600 transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
      </motion.div>
    </motion.div>
  );
}
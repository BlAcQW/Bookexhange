import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        {/* First book */}
        <motion.div
          className="absolute"
          initial={{ rotate: -15, x: -5 }}
          animate={{ rotate: -15, x: -5 }}
          whileHover={{ rotate: -25, x: -8 }}
          transition={{ duration: 0.3 }}
        >
          <BookOpen className="h-8 w-8 text-primary dark:text-primary-light transform -scale-x-100" />
        </motion.div>
        
        {/* Second book */}
        <motion.div
          initial={{ rotate: 15, x: 5 }}
          animate={{ rotate: 15, x: 5 }}
          whileHover={{ rotate: 25, x: 8 }}
          transition={{ duration: 0.3 }}
        >
          <BookOpen className="h-8 w-8 text-primary dark:text-primary-light" />
        </motion.div>
      </div>
      
      <div className="flex flex-col">
        <motion.span 
          className="font-bold text-xl text-gray-900 dark:text-white"
          initial={{ y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          TextbookXchange
        </motion.span>
        <motion.span
          className="text-xs text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0.8, y: 0 }}
          whileHover={{ opacity: 1, y: -1 }}
          transition={{ duration: 0.2 }}
        >
          Smart Book Exchange for Smart Students
        </motion.span>
      </div>
    </Link>
  );
}
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  color: string;
  description: string;
  image: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function CategoryGrid() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const categories: Category[] = [
    {
      name: 'Computer Science & IT',
      color: 'from-blue-600/90 to-blue-900/90',
      description: 'Browse Computer Science & IT books',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
    },
    {
      name: 'Engineering',
      color: 'from-orange-600/90 to-orange-900/90',
      description: 'Browse Engineering books',
      image: 'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=800&q=80'
    },
    {
      name: 'Science',
      color: 'from-yellow-600/90 to-yellow-900/90',
      description: 'Browse Science books',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80'
    },
    {
      name: 'Arts & Humanities',
      color: 'from-purple-600/90 to-purple-900/90',
      description: 'Browse Arts & Humanities books',
      image: 'https://images.unsplash.com/photo-1544133782-b62779394064?w=800&q=80'
    },
    {
      name: 'Mathematics',
      color: 'from-red-600/90 to-red-900/90',
      description: 'Browse Mathematics books',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80'
    },
    {
      name: 'Health Sciences',
      color: 'from-teal-600/90 to-teal-900/90',
      description: 'Browse Health Sciences books',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
    },
    {
      name: 'Business & Economics',
      color: 'from-indigo-600/90 to-indigo-900/90',
      description: 'Browse Business & Economics books',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    }
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/books?category=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => (
        <motion.div
          key={category.name}
          variants={item}
          whileHover={{ y: -8 }}
          onClick={() => handleCategoryClick(category.name)}
          className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
            isDark ? 'shadow-gray-800' : 'shadow-gray-200'
          }`}
        >
          {/* Image with gradient overlay */}
          <div className="aspect-[4/3] relative">
            <motion.img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            {/* Double gradient for better text readability */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <motion.div 
            className="absolute inset-0 p-6 flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-2 text-white transform group-hover:translate-x-2 transition-transform drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-white/90 transform group-hover:translate-x-2 transition-transform delay-75 drop-shadow-lg">
              {category.description}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
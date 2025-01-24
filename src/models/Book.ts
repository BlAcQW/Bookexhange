import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    maxlength: [50, 'Author name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Law', 'Nursing', 'Midwifery', 'Business', 'Pharmacy'],
  },
  condition: {
    type: String,
    required: [true, 'Please specify the book condition'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
  },
  price: {
    type: Number,
    required: [true, 'Please specify a price'],
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export default mongoose.models.Book || mongoose.model('Book', bookSchema);
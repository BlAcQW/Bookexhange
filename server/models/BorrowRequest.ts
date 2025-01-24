import mongoose from 'mongoose';

const borrowRequestSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
});

export default mongoose.models.BorrowRequest || mongoose.model('BorrowRequest', borrowRequestSchema);
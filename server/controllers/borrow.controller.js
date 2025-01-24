import BorrowRequest from '../models/BorrowRequest.js';
import Book from '../models/Book.js';

export const createBorrowRequest = async (req, res) => {
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.available) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    const borrowRequest = new BorrowRequest({
      book: req.body.bookId,
      borrower: req.user.userId,
      owner: book.owner,
    });

    await borrowRequest.save();
    res.status(201).json(borrowRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating borrow request' });
  }
};

export const getBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      $or: [{ borrower: req.user.userId }, { owner: req.user.userId }],
    })
      .populate('book')
      .populate('borrower', 'name email')
      .populate('owner', 'name email');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrow requests' });
  }
};

export const updateBorrowRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    if (request.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = req.body.status;
    if (req.body.status === 'approved') {
      const book = await Book.findById(request.book);
      book.available = false;
      await book.save();
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating borrow request' });
  }
};
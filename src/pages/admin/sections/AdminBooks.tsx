import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BooksList } from '../components/books/BooksList';
import { AddEditBook } from '../components/books/AddEditBook';

export function AdminBooks() {
  return (
    <Routes>
      <Route path="/" element={<BooksList />} />
      <Route path="/add" element={<AddEditBook />} />
      <Route path="/edit/:id" element={<AddEditBook />} />
    </Routes>
  );
}
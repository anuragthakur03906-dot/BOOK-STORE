export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Sci-Fi',
  'Mystery',
  'Biography',
  'Self-Help',
  'Technology',
  'Fantasy',
  'Romance'
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'publishedYear', label: 'Published Year' }
];
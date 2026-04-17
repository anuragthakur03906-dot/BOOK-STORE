/**
 * @file helpers/queryBuilder.js
 * @description Database query building helpers for filtering, sorting, and searching
 */

/**
 * Build filter object for books
 * @param {Object} query - Query parameters
 * @returns {Object} MongoDB filter object
 */
export const buildFilter = (query) => {
  const filter = {};
  
  // Search filter
  const querySearch = (query.search || '').trim();
  if (querySearch) {
    filter.$or = [
      { title: { $regex: querySearch, $options: 'i' } },
      { author: { $regex: querySearch, $options: 'i' } },
      { description: { $regex: querySearch, $options: 'i' } }
    ];
  }
  
  // Genre filter
  if (query.genre) {
    filter.genre = query.genre;
  }
  
  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) {
      filter.price.$gte = parseFloat(query.minPrice);
    }
    if (query.maxPrice) {
      filter.price.$lte = parseFloat(query.maxPrice);
    }
  }
  
  // Rating filter
  if (query.minRating) {
    filter.rating = { $gte: parseFloat(query.minRating) };
  }
  
  // In stock filter
  if (query.inStock !== undefined) {
    filter.inStock = query.inStock === 'true';
  }
  
  // Year filter
  if (query.year) {
    filter.publishedYear = parseInt(query.year);
  }
  
  return filter;
};

/**
 * Build sort object
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} MongoDB sort object
 */
export const buildSort = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const sort = {};
  const order = sortOrder === 'asc' ? 1 : -1;
  
  // Map frontend sortBy to database fields
  const sortMap = {
    'title': 'title',
    'author': 'author',
    'price': 'price',
    'rating': 'rating',
    'publishedYear': 'publishedYear',
    'createdAt': 'createdAt',
    'updatedAt': 'updatedAt'
  };
  
  const field = sortMap[sortBy] || 'createdAt';
  sort[field] = order;
  
  return sort;
};

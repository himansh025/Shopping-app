/**
 * Generates an SEO-friendly slug from text.
 * e.g., "Nike MC Trainer 3 Men's Shoes" -> "nike-mc-trainer-3-mens-shoes"
 */
export function createSlug(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Standardized professional product URL generator.
 * Produces clean, SEO-rich URLs like:
 *   /product/nike-mc-trainer-3-mens-workout-shoes/67cc7f1d4c0e7fe61e7f7518
 * Or falls back gracefully to:
 *   /product/67cc7f1d4c0e7fe61e7f7518
 *
 * @param {Object|string} productOrId - Product object or direct string ID
 * @param {string} [nameHint] - Optional product name if only ID was passed
 * @returns {string} Professional product URL path
 */
export function getProductUrl(productOrId, nameHint = '') {
  if (!productOrId) return '/';

  if (typeof productOrId === 'object') {
    const id = productOrId._id || productOrId.id;
    if (!id) return '/';
    const name = productOrId.name || nameHint;
    const slug = name ? createSlug(name) : '';
    return slug ? `/product/${slug}/${id}` : `/product/${id}`;
  }

  const id = String(productOrId).trim();
  const slug = nameHint ? createSlug(nameHint) : '';
  return slug ? `/product/${slug}/${id}` : `/product/${id}`;
}

/**
 * Standardized category URL generator.
 * e.g., "Men" -> "/category/men", "Electronics" -> "/category/electronics"
 */
export function getCategoryUrl(category = '') {
  if (!category) return '/';
  const slug = createSlug(category);
  return slug ? `/category/${slug}` : '/';
}

/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export function Card({ items = [], remove }) {
  const [pureItem, setPureItem] = useState([]);

  useEffect(() => {
    if (remove && Array.isArray(items)) {
      const removeId = remove._id || remove[0]?._id;
      const filtered = items.filter((item) => (item._id || item.id) !== removeId);
      setPureItem(filtered);
    } else {
      setPureItem(items);
    }
  }, [items, remove]);

  const displayList = pureItem && pureItem.length > 0 ? pureItem : items;

  if (!displayList || displayList.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayList.map((product, index) => (
        <ProductCard
          key={product._id || product.id || index}
          product={product}
        />
      ))}
    </div>
  );
}

export { Card as ProductGrid };
export default Card;

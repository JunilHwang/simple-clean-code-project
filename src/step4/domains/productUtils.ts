import type { Product, Products } from './types.ts';
import type { ProductOptions } from './constants.ts';

export const productUtils = {
  getFilteredItems: (
    products: Products,
    { searchKey = '', orderBy, sortBy = 'default' }: Partial<ProductOptions>
  ) => {
    const values = Object.values(products);
    const searchedItems =
      searchKey.trim() === ''
        ? values
        : values.filter((item) =>
            item.name.toLowerCase().includes(searchKey.toLowerCase())
          );

    if (sortBy === 'default') {
      return searchedItems;
    }

    return searchedItems.sort((a, b) => {
      const comparison =
        sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price;

      return orderBy === 'asc' ? comparison : -comparison;
    });
  },
  isOutOfStock: (product: Product) => product.quantity === 0,
};

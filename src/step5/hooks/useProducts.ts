import { useState } from 'react';
import type { Product, Products } from '../domains/types.ts';
import { productUtils } from '../domains/productUtils.ts';
import {
  INITIAL_PRODUCT_OPTIONS,
  INITIAL_PRODUCTS,
  type ProductOptions,
} from '../domains/constants.ts';

const toMap = (arr: Product[]): Products =>
  arr.reduce((acc, product) => ({ ...acc, [product.id]: product }), {});

export const useProducts = (initValue = INITIAL_PRODUCTS) => {
  const [products] = useState(() => toMap(initValue));
  const [options, setOptions] = useState(() => INITIAL_PRODUCT_OPTIONS);

  const filteredItems = productUtils.getFilteredItems(products, options);

  const changeOptions = (newOptions: Partial<ProductOptions>) =>
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));

  return { items: products, filteredItems, changeOptions };
};

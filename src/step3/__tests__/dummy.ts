import type { Product } from '../domains.ts';

export const MOCK_PRODUCT_1: Product = {
  id: '1',
  name: '상품1',
  price: 10000,
  image: 'image1.jpg',
  quantity: 2,
};
export const MOCK_PRODUCT_2: Product = {
  id: '2',
  name: '상품2',
  price: 20000,
  image: 'image2.jpg',
  quantity: 3,
};
export const MOCK_PRODUCTS = [{ ...MOCK_PRODUCT_1 }, { ...MOCK_PRODUCT_2 }];

import type { Product } from './domains/types.ts';

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

export const MOCK_PRODUCT_3: Product = {
  id: '3',
  name: '상품1-특별할인',
  price: 500,
  image: 'image3.jpg',
  quantity: 5,
};

export const MOCK_PRODUCT_OUT_OF_STOCK: Product = {
  id: '4',
  name: '품절상품',
  price: 15000,
  image: 'image4.jpg',
  quantity: 0,
};

export const MOCK_PRODUCTS = [
  { ...MOCK_PRODUCT_1 },
  { ...MOCK_PRODUCT_2 },
  { ...MOCK_PRODUCT_3 },
  { ...MOCK_PRODUCT_OUT_OF_STOCK },
];

export const MOCK_PRODUCTS_MAP = {
  [MOCK_PRODUCT_1.id]: { ...MOCK_PRODUCT_1 },
  [MOCK_PRODUCT_2.id]: { ...MOCK_PRODUCT_2 },
  [MOCK_PRODUCT_3.id]: { ...MOCK_PRODUCT_3 },
  [MOCK_PRODUCT_OUT_OF_STOCK.id]: { ...MOCK_PRODUCT_OUT_OF_STOCK },
};

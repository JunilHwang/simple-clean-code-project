import type { Product } from './types.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '맥북 프로 14인치',
    price: 2_990_000,
    image: 'https://picsum.photos/id/1/200.webp',
    quantity: 5,
  },
  {
    id: '2',
    name: '아이폰 15 Pro',
    price: 1_550_000,
    image: 'https://picsum.photos/id/2/200.webp',
    quantity: 10,
  },
  {
    id: '3',
    name: '갤럭시 S24',
    price: 1_200_000,
    image: 'https://picsum.photos/id/3/200.webp',
    quantity: 0,
  },
  {
    id: '4',
    name: '에어팟 프로',
    price: 350_000,
    image: 'https://picsum.photos/id/4/200.webp',
    quantity: 15,
  },
  {
    id: '5',
    name: '맥북 에어',
    price: 1_590_000,
    image: 'https://picsum.photos/id/5/200.webp',
    quantity: 3,
  },
  {
    id: '6',
    name: '아이패드 프로',
    price: 1_490_000,
    image: 'https://picsum.photos/id/6/200.webp',
    quantity: 7,
  },
  {
    id: '7',
    name: '삼성 모니터',
    price: 450_000,
    image: 'https://picsum.photos/id/7/200.webp',
    quantity: 2,
  },
  {
    id: '8',
    name: '무선 키보드',
    price: 120_000,
    image: 'https://picsum.photos/id/8/200.webp',
    quantity: 20,
  },
  {
    id: '9',
    name: '무선 마우스',
    price: 80_000,
    image: 'https://picsum.photos/id/9/200.webp',
    quantity: 25,
  },
  {
    id: '10',
    name: '스피커',
    price: 250_000,
    image: 'https://picsum.photos/id/10/200.webp',
    quantity: 8,
  },
];

export const INITIAL_PRODUCT_OPTIONS = {
  searchKey: '',
  orderBy: 'asc' as 'asc' | 'desc',
  sortBy: 'default' as 'name' | 'price' | 'default',
};

export type ProductOptions = typeof INITIAL_PRODUCT_OPTIONS;

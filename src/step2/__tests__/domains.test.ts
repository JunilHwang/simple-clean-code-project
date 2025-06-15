import { afterEach, describe, expect, test } from 'vitest';
import { createStore, type Product } from '../domains';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: '상품1', price: 10000, image: 'image1.jpg' },
  { id: '2', name: '상품2', price: 20000, image: 'image2.jpg' },
];

describe('Domains > ', () => {
  const store = createStore({ products: MOCK_PRODUCTS });

  afterEach(() => {
    store.carts.clear();
  });

  test('상품 목록을 조회할 수 있으며, 이름/가격/상품이미지 등을 확인할 수 있다.', () => {
    expect(store.products.items).toEqual([
      { id: '1', name: '상품1', price: 10000, image: 'image1.jpg' },
      { id: '2', name: '상품2', price: 20000, image: 'image2.jpg' },
    ]);

    expect(store.products.value).toEqual({
      '1': { id: '1', name: '상품1', price: 10000, image: 'image1.jpg' },
      '2': { id: '2', name: '상품2', price: 20000, image: 'image2.jpg' },
    });
  });

  test('상품을 장바구니에 담을 수 있다.', () => {
    store.carts.add('1');
    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 1 },
    });

    store.carts.add('2');
    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 1 },
      '2': { productId: '2', quantity: 1 },
    });
  });

  test('수량 변경이 가능하고, 최소값은 1이다.', () => {
    store.carts.add('1');
    store.carts.update('1', 3);
    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 3 },
    });

    store.carts.update('1', -100);
    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 1 },
    });
  });

  test('장바구니에서 개별 상품을 삭제할 수 있다.', () => {
    store.carts.add('1');
    store.carts.update('1', 3);
    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 3 },
    });

    store.carts.remove('1');
    expect(store.carts.value).toEqual({});
    expect(store.carts.items).toEqual([]);
  });

  test('장바구니를 한 번에 비울 수 있다.', () => {
    store.carts.add('1');
    store.carts.add('2');

    expect(store.carts.value).toEqual({
      '1': { productId: '1', quantity: 1 },
      '2': { productId: '2', quantity: 1 },
    });

    store.carts.clear();
    expect(store.carts.value).toEqual({});
    expect(store.carts.items).toEqual([]);
  });

  test('개별 상품 소계를 확인할 수 있다.', () => {
    store.carts.add('1');
    store.carts.update('1', 3); // 30000
    store.carts.add('2'); // 20000
    expect(store.cartsWithProduct).toEqual([
      {
        id: '1',
        image: 'image1.jpg',
        name: '상품1',
        price: 10000,
        quantity: 3,
        subtotal: 30000,
      },
      {
        id: '2',
        image: 'image2.jpg',
        name: '상품2',
        price: 20000,
        quantity: 1,
        subtotal: 20000,
      },
    ]);
  });

  test('장바구니에 담긴 전체 상품 가격을 확인할 수 있따.', () => {
    store.carts.add('1');
    store.carts.update('1', 3); // 30000
    store.carts.add('2'); // 20000

    expect(store.totalCartPrice).toBe(50000); // 30000 + 20000
  });
});

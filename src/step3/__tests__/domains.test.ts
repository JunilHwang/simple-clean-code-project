import { afterEach, describe, expect, test } from 'vitest';
import { createStore } from '../domains';
import { MOCK_PRODUCT_1, MOCK_PRODUCT_2, MOCK_PRODUCTS } from './dummy.ts';

describe('Domains > ', () => {
  const store = createStore({ products: [...MOCK_PRODUCTS] });

  afterEach(() => {
    store.carts.clear();
  });

  test('상품 목록을 조회할 수 있으며, 이름/가격/상품이미지 등을 확인할 수 있다.', () => {
    expect(store.products.items).toEqual([MOCK_PRODUCT_1, MOCK_PRODUCT_2]);

    expect(store.products.value).toEqual({
      [MOCK_PRODUCT_1.id]: MOCK_PRODUCT_1,
      [MOCK_PRODUCT_2.id]: MOCK_PRODUCT_2,
    });
  });

  test('상품 목록에 대해 검색, 정렬(가격, 이름) 이 가능하다.', () => {
    const MOCK_PRODUCT_3 = {
      id: '3',
      name: '상품1 - 특별할인',
      price: 500,
      image: 'image3.jpg',
      quantity: 5,
    };
    const store2 = createStore({
      products: [...MOCK_PRODUCTS, MOCK_PRODUCT_3],
    });

    expect(store2.products.sort({ sortBy: 'name', orderBy: 'asc' })).toEqual([
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
      MOCK_PRODUCT_2,
    ]);
    expect(store2.products.sort({ sortBy: 'name', orderBy: 'desc' })).toEqual([
      MOCK_PRODUCT_2,
      MOCK_PRODUCT_3,
      MOCK_PRODUCT_1,
    ]);
    expect(store2.products.sort({ sortBy: 'price', orderBy: 'asc' })).toEqual([
      MOCK_PRODUCT_3,
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_2,
    ]);
    expect(store2.products.sort({ sortBy: 'price', orderBy: 'desc' })).toEqual([
      MOCK_PRODUCT_2,
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
    ]);

    expect(store2.products.search('상품1')).toEqual([
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
    ]);
    expect(store2.products.sort({ sortBy: 'name', orderBy: 'asc' })).toEqual([
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
    ]);
    expect(store2.products.sort({ sortBy: 'name', orderBy: 'desc' })).toEqual([
      MOCK_PRODUCT_3,
      MOCK_PRODUCT_1,
    ]);
    expect(store2.products.sort({ sortBy: 'price', orderBy: 'asc' })).toEqual([
      MOCK_PRODUCT_3,
      MOCK_PRODUCT_1,
    ]);
    expect(store2.products.sort({ sortBy: 'price', orderBy: 'desc' })).toEqual([
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
    ]);

    expect(store2.products.search('상품2')).toEqual([MOCK_PRODUCT_2]);
    expect(store2.products.search('상품3')).toEqual([]);
    expect(store2.products.search('')).toEqual([
      MOCK_PRODUCT_2,
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_3,
    ]);
    expect(store2.products.sort({ sortBy: 'default' })).toEqual([
      MOCK_PRODUCT_1,
      MOCK_PRODUCT_2,
      MOCK_PRODUCT_3,
    ]);
  });

  test('상품을 장바구니에 담을 수 있으며, 상품 재고의 수량만큼만 장바구니에 담을 수 없다.', () => {
    store.addToCart(MOCK_PRODUCT_1.id);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_1.id]: {
        productId: MOCK_PRODUCT_1.id,
        quantity: 1,
        selected: false,
      },
    });

    store.addToCart(MOCK_PRODUCT_1.id);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_1.id]: {
        productId: MOCK_PRODUCT_1.id,
        quantity: 2,
        selected: false,
      },
    });

    store.addToCart(MOCK_PRODUCT_1.id);
    expect(store.products.value[MOCK_PRODUCT_1.id].quantity).toBe(2);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_1.id]: {
        productId: MOCK_PRODUCT_1.id,
        quantity: 2,
        selected: false,
      },
    });
  });

  test('장바구니의 개별 상품에 대한 수량 변경이 가능하고, 재고보다 더 담을 수 없으며, 장바구니의 수량은 1보다 작을 수 없다.', () => {
    store.addToCart(MOCK_PRODUCT_2.id);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_2.id]: {
        productId: MOCK_PRODUCT_2.id,
        quantity: 1,
        selected: false,
      },
    });

    store.incrementCartQuantity(MOCK_PRODUCT_2.id, 2);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_2.id]: {
        productId: MOCK_PRODUCT_2.id,
        quantity: 3,
        selected: false,
      },
    });

    store.incrementCartQuantity(MOCK_PRODUCT_2.id, 2);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_2.id]: {
        productId: MOCK_PRODUCT_2.id,
        quantity: 3,
        selected: false,
      },
    });

    store.incrementCartQuantity(MOCK_PRODUCT_2.id, -100);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_2.id]: {
        productId: MOCK_PRODUCT_2.id,
        quantity: 1,
        selected: false,
      },
    });
  });

  test('장바구니에서 개별 상품을 삭제할 수 있다.', () => {
    store.addToCart(MOCK_PRODUCT_1.id);
    store.carts.updateQuantity(MOCK_PRODUCT_1.id, 3);
    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_1.id]: {
        productId: MOCK_PRODUCT_1.id,
        quantity: 3,
        selected: false,
      },
    });

    store.carts.remove(MOCK_PRODUCT_1.id);
    expect(store.carts.value).toEqual({});
    expect(store.carts.items).toEqual([]);
  });

  test('장바구니를 한 번에 비울 수 있다.', () => {
    store.carts.add(MOCK_PRODUCT_1.id);
    store.carts.add(MOCK_PRODUCT_2.id);

    expect(store.carts.value).toEqual({
      [MOCK_PRODUCT_1.id]: {
        productId: MOCK_PRODUCT_1.id,
        quantity: 1,
        selected: false,
      },
      [MOCK_PRODUCT_2.id]: {
        productId: MOCK_PRODUCT_2.id,
        quantity: 1,
        selected: false,
      },
    });

    store.carts.clear();
    expect(store.carts.value).toEqual({});
    expect(store.carts.items).toEqual([]);
  });

  test('개별 상품 소계를 확인할 수 있다.', () => {
    store.carts.add(MOCK_PRODUCT_1.id);
    store.carts.updateQuantity(MOCK_PRODUCT_1.id, 3); // 30000
    store.carts.add(MOCK_PRODUCT_2.id); // 20000
    expect(store.cartsWithProduct).toEqual([
      {
        id: MOCK_PRODUCT_1.id,
        image: 'image1.jpg',
        name: '상품1',
        price: 10000,
        quantity: 3,
        subtotal: 30000,
        selected: false,
      },
      {
        id: MOCK_PRODUCT_2.id,
        image: 'image2.jpg',
        name: '상품2',
        price: 20000,
        quantity: 1,
        subtotal: 20000,
        selected: false,
      },
    ]);
  });

  test('장바구니에 담긴 전체 상품 가격을 확인할 수 있따.', () => {
    store.carts.add(MOCK_PRODUCT_1.id);
    store.carts.updateQuantity(MOCK_PRODUCT_1.id, 3); // 30000
    store.carts.add(MOCK_PRODUCT_2.id); // 20000

    expect(store.totalCartPrice).toBe(50000); // 30000 + 20000
  });

  test('실제로 없는 제품을 장바구니에 추가할 경우, totalCartPrice는 0이 된다.', () => {
    store.carts.add('3');

    expect(store.totalCartPrice).toBe(0); // 30000 + 20000
  });

  test('장바구니에 담긴 제품을 선택하여 삭제할 수 있다.', () => {
    store.addToCart(MOCK_PRODUCT_1.id);
    store.addToCart(MOCK_PRODUCT_2.id);
    store.carts.toggleSelect(MOCK_PRODUCT_1.id);
    expect(store.carts.value[MOCK_PRODUCT_1.id].selected).toBe(true);

    store.carts.toggleSelect(MOCK_PRODUCT_1.id);
    expect(store.carts.value[MOCK_PRODUCT_1.id].selected).toBe(false);

    store.carts.toggleSelect(MOCK_PRODUCT_1.id);
    store.carts.toggleSelect(MOCK_PRODUCT_2.id);
    expect(store.carts.selectedItems).toEqual([
      { productId: '1', quantity: 1, selected: true },
      { productId: '2', quantity: 1, selected: true },
    ]);
    store.carts.deselectAll();
    expect(store.carts.selectedItems).toEqual([]);

    store.carts.selectAll();
    expect(store.carts.selectedItems).toEqual([
      { productId: '1', quantity: 1, selected: true },
      { productId: '2', quantity: 1, selected: true },
    ]);

    store.carts.removeSelected();
    expect(store.carts.selectedItems).toEqual([]);
    expect(store.carts.items).toEqual([]);
  });
});

import { describe, expect, test } from 'vitest';
import {
  MOCK_PRODUCTS_MAP,
  MOCK_PRODUCT_1,
  MOCK_PRODUCT_2,
} from '../../dummies.ts';
import { cartService } from '../cartService.ts';
import type { Carts } from '../types.ts';

describe('cartService > ', () => {
  describe('getTotalCartPrice', () => {
    test('빈 장바구니의 총 가격은 0이다', () => {
      const carts: Carts = {};
      const result = cartService.getTotalCartPrice(carts, MOCK_PRODUCTS_MAP);

      expect(result).toBe(0);
    });

    test('장바구니에 담긴 상품들의 총 가격을 계산할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 2,
          selected: false,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.getTotalCartPrice(carts, MOCK_PRODUCTS_MAP);

      // 상품1: 10000 * 2 = 20000, 상품2: 20000 * 1 = 20000
      expect(result).toBe(40000);
    });

    test('존재하지 않는 상품은 가격 계산에서 제외된다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 2,
          selected: false,
        },
        '999': {
          productId: '999',
          quantity: 5,
          selected: false,
        },
      };
      const result = cartService.getTotalCartPrice(carts, MOCK_PRODUCTS_MAP);

      // 상품1만 계산: 10000 * 2 = 20000
      expect(result).toBe(20000);
    });
  });

  describe('getCartsWithProduct', () => {
    test('장바구니 정보와 상품 정보를 결합할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 2,
          selected: true,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.getCartsWithProduct(carts, MOCK_PRODUCTS_MAP);

      expect(result).toEqual([
        {
          ...MOCK_PRODUCT_1,
          quantity: 2,
          selected: true,
          subtotal: 20000,
        },
        {
          ...MOCK_PRODUCT_2,
          quantity: 1,
          selected: false,
          subtotal: 20000,
        },
      ]);
    });

    test('빈 장바구니는 빈 배열을 반환한다', () => {
      const carts: Carts = {};
      const result = cartService.getCartsWithProduct(carts, MOCK_PRODUCTS_MAP);

      expect(result).toEqual([]);
    });
  });

  describe('addToCart', () => {
    test('빈 장바구니에 상품을 추가할 수 있다', () => {
      const carts: Carts = {};
      const result = cartService.addToCart(carts, MOCK_PRODUCTS_MAP, '1');

      expect(result).toEqual({
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      });
    });

    test('이미 담긴 상품의 수량을 증가시킬 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.addToCart(carts, MOCK_PRODUCTS_MAP, '1');

      expect(result['1'].quantity).toBe(2);
    });

    test('품절 상품은 장바구니에 추가할 수 없다', () => {
      const carts: Carts = {};
      const result = cartService.addToCart(carts, MOCK_PRODUCTS_MAP, '4'); // 품절상품

      expect(result).toEqual({});
    });

    test('재고보다 많이 담을 수 없다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 2, // 재고는 2개
          selected: false,
        },
      };
      const result = cartService.addToCart(carts, MOCK_PRODUCTS_MAP, '1');

      expect(result['1'].quantity).toBe(2); // 증가하지 않음
    });
  });

  describe('incrementCartQuantity', () => {
    test('장바구니 상품의 수량을 증가시킬 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.incrementCartQuantity(
        carts,
        MOCK_PRODUCTS_MAP,
        '1',
        1
      );

      expect(result['1'].quantity).toBe(2);
    });

    test('재고 수량을 초과할 수 없다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.incrementCartQuantity(
        carts,
        MOCK_PRODUCTS_MAP,
        '1',
        5
      );

      expect(result['1'].quantity).toBe(2); // 재고는 2개까지
    });

    test('수량을 감소시킬 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 3,
          selected: false,
        },
      };
      const result = cartService.incrementCartQuantity(
        carts,
        MOCK_PRODUCTS_MAP,
        '2',
        -1
      );

      expect(result['2'].quantity).toBe(2);
    });

    test('수량이 1보다 작아질 수 없다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartService.incrementCartQuantity(
        carts,
        MOCK_PRODUCTS_MAP,
        '1',
        -5
      );

      expect(result['1'].quantity).toBe(1);
    });
  });
});

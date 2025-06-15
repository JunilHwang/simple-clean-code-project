import { describe, expect, test } from 'vitest';
import { cartUtils } from '../cartUtils.ts';
import type { Carts } from '../types.ts';
import { MOCK_PRODUCT_1, MOCK_PRODUCT_2 } from '../../dummies.ts';

describe('cartUtils > ', () => {
  describe('add', () => {
    test('빈 장바구니에 상품을 추가할 수 있다', () => {
      const carts: Carts = {};
      const result = cartUtils.add(carts, MOCK_PRODUCT_1.id);

      expect(result).toEqual({
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      });
    });

    test('이미 있는 상품의 수량을 증가시킬 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartUtils.add(carts, MOCK_PRODUCT_1.id);

      expect(result).toEqual({
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 2,
          selected: false,
        },
      });
    });

    test('기존 장바구니 상태를 변경하지 않는다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      cartUtils.add(carts, MOCK_PRODUCT_1.id);

      expect(carts[MOCK_PRODUCT_1.id].quantity).toBe(1); // 원본 불변
    });
  });

  describe('updateQuantity', () => {
    test('상품의 수량을 변경할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartUtils.updateQuantity(carts, MOCK_PRODUCT_1.id, 5);

      expect(result[MOCK_PRODUCT_1.id].quantity).toBe(5);
    });

    test('수량이 1보다 작으면 1로 설정된다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 3,
          selected: false,
        },
      };
      const result = cartUtils.updateQuantity(carts, MOCK_PRODUCT_1.id, 0);

      expect(result[MOCK_PRODUCT_1.id].quantity).toBe(1);
    });

    test('음수 수량도 1로 설정된다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 3,
          selected: false,
        },
      };
      const result = cartUtils.updateQuantity(carts, MOCK_PRODUCT_1.id, -5);

      expect(result[MOCK_PRODUCT_1.id].quantity).toBe(1);
    });
  });

  describe('remove', () => {
    test('특정 상품을 장바구니에서 제거할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: true,
        },
      };
      const result = cartUtils.remove(carts, MOCK_PRODUCT_1.id);

      expect(result).toEqual({
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: true,
        },
      });
    });

    test('존재하지 않는 상품을 제거해도 에러가 발생하지 않는다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartUtils.remove(carts, '999');

      expect(result).toEqual(carts);
    });
  });

  describe('removeSelected', () => {
    test('선택된 상품들을 제거할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: true,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: false,
        },
        '3': {
          productId: '3',
          quantity: 3,
          selected: true,
        },
      };
      const result = cartUtils.removeSelected(carts);

      expect(result).toEqual({
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: false,
        },
      });
    });

    test('선택된 상품이 없으면 모든 상품이 유지된다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: false,
        },
      };
      const result = cartUtils.removeSelected(carts);

      expect(result).toEqual(carts);
    });
  });

  describe('toggleSelect', () => {
    test('상품의 선택 상태를 토글할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
      };
      const result = cartUtils.toggleSelect(carts, MOCK_PRODUCT_1.id);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(true);
    });

    test('이미 선택된 상품을 토글하면 선택 해제된다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: true,
        },
      };
      const result = cartUtils.toggleSelect(carts, MOCK_PRODUCT_1.id);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(false);
    });
  });

  describe('updateAllSelected', () => {
    test('모든 상품의 선택 상태를 true로 변경할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: true,
        },
      };
      const result = cartUtils.updateAllSelected(carts, true);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(true);
      expect(result[MOCK_PRODUCT_2.id].selected).toBe(true);
    });

    test('모든 상품의 선택 상태를 false로 변경할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: true,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: true,
        },
      };
      const result = cartUtils.updateAllSelected(carts, false);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(false);
      expect(result[MOCK_PRODUCT_2.id].selected).toBe(false);
    });
  });

  describe('selectAll', () => {
    test('모든 상품을 선택할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: false,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: false,
        },
      };
      const result = cartUtils.selectAll(carts);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(true);
      expect(result[MOCK_PRODUCT_2.id].selected).toBe(true);
    });
  });

  describe('deselectAll', () => {
    test('모든 상품의 선택을 해제할 수 있다', () => {
      const carts: Carts = {
        [MOCK_PRODUCT_1.id]: {
          productId: MOCK_PRODUCT_1.id,
          quantity: 1,
          selected: true,
        },
        [MOCK_PRODUCT_2.id]: {
          productId: MOCK_PRODUCT_2.id,
          quantity: 2,
          selected: true,
        },
      };
      const result = cartUtils.deselectAll(carts);

      expect(result[MOCK_PRODUCT_1.id].selected).toBe(false);
      expect(result[MOCK_PRODUCT_2.id].selected).toBe(false);
    });
  });
});

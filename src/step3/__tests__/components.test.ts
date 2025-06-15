import { describe, expect, test } from 'vitest';
import {
  App,
  CartItem,
  CartSummary,
  ProductControls,
  ProductItem,
} from '../components';
import { MOCK_PRODUCT_1, MOCK_PRODUCT_2 } from './dummy';
import type { CartWithProduct } from '../domains';

describe('Components > ', () => {
  describe('ProductItem', () => {
    test('일반 상품이 올바르게 렌더링된다', () => {
      const html = ProductItem(MOCK_PRODUCT_1);

      // 상품 정보가 포함되어야 함
      expect(html).toContain('상품1');
      expect(html).toContain('10,000원');
      expect(html).toContain('재고: 2개');
      expect(html).toContain('image1.jpg');
      expect(html).toContain('data-product-id="1"');

      // 일반 상품이므로 품절 관련 요소가 없어야 함
      expect(html).not.toContain('품절');
      expect(html).not.toContain('opacity-50');
      expect(html).not.toContain('disabled');
      expect(html).toContain('장바구니 담기');
      expect(html).toContain('bg-blue-500');
    });

    test('품절 상품이 올바르게 렌더링된다', () => {
      const soldOutProduct = { ...MOCK_PRODUCT_1, quantity: 0 };
      const html = ProductItem(soldOutProduct);

      // 품절 상태가 반영되어야 함
      expect(html).toContain('품절');
      expect(html).toContain('opacity-50');
      expect(html).toContain('disabled');
      expect(html).toContain('bg-gray-400');
      expect(html).toContain('cursor-not-allowed');
      expect(html).toContain('bg-black bg-opacity-50');

      // 장바구니 담기 버튼이 비활성화되어야 함
      expect(html).not.toContain('장바구니 담기');
      expect(html).not.toContain('bg-blue-500');
    });
  });

  describe('CartItem', () => {
    test('장바구니 아이템이 올바르게 렌더링된다', () => {
      const cartItem: CartWithProduct = {
        id: '1',
        quantity: 2,
        image: 'image1.jpg',
        name: '상품1',
        price: 10000,
        selected: false,
        subtotal: 20000,
      };

      const html = CartItem(cartItem);

      // 기본 정보가 포함되어야 함
      expect(html).toContain('상품1');
      expect(html).toContain('image1.jpg');
      expect(html).toContain('10,000원');
      expect(html).toContain('2개');
      expect(html).toContain('20,000원');
      expect(html).toContain('data-product-id="1"');

      // 체크박스가 선택되지 않은 상태여야 함
      expect(html).not.toContain('checked');

      // 수량 조절 버튼들이 포함되어야 함
      expect(html).toContain('decrease-btn');
      expect(html).toContain('increase-btn');
      expect(html).toContain('remove-btn');
    });

    test('선택된 장바구니 아이템이 올바르게 렌더링된다', () => {
      const selectedCartItem: CartWithProduct = {
        id: '2',
        quantity: 1,
        image: 'image2.jpg',
        name: '상품2',
        price: 20000,
        selected: true,
        subtotal: 20000,
      };

      const html = CartItem(selectedCartItem);

      // 체크박스가 선택된 상태여야 함
      expect(html).toContain('checked');
      expect(html).toContain('data-product-id="2"');
    });
  });

  describe('CartSummary', () => {
    test('선택된 아이템이 있을 때 올바르게 렌더링된다', () => {
      const html = CartSummary({ totalPrice: 50000, selection: true });

      // 총 합계가 표시되어야 함
      expect(html).toContain('총 합계:');
      expect(html).toContain('50,000원');

      // 선택 삭제 버튼이 활성화되어야 함
      expect(html).toContain('bg-orange-500');
      expect(html).toContain('hover:bg-orange-600');
      expect(html).not.toContain('disabled');
      expect(html).not.toContain('cursor-not-allowed');

      // 전체 비우기 버튼이 포함되어야 함
      expect(html).toContain('전체 비우기');
      expect(html).toContain('bg-red-500');
    });

    test('선택된 아이템이 없을 때 올바르게 렌더링된다', () => {
      const html = CartSummary({ totalPrice: 0, selection: false });

      // 총 합계가 0원으로 표시되어야 함
      expect(html).toContain('0원');

      // 선택 삭제 버튼이 비활성화되어야 함
      expect(html).toContain('bg-gray-400');
      expect(html).toContain('cursor-not-allowed');
      expect(html).toContain('disabled');
      expect(html).not.toContain('bg-orange-500');
    });
  });

  describe('ProductControls', () => {
    test('상품 컨트롤이 올바르게 렌더링된다', () => {
      const html = ProductControls();

      // 검색 입력 필드가 포함되어야 함
      expect(html).toContain('search-input');
      expect(html).toContain('상품명으로 검색...');
      expect(html).toContain('type="text"');

      // 정렬 선택 필드들이 포함되어야 함
      expect(html).toContain('sort-select');
      expect(html).toContain('order-select');

      // 정렬 옵션들이 포함되어야 함
      expect(html).toContain('기본순');
      expect(html).toContain('이름순');
      expect(html).toContain('가격순');
      expect(html).toContain('오름차순');
      expect(html).toContain('내림차순');
    });
  });

  describe('App', () => {
    test('장바구니가 비어있을 때 올바르게 렌더링된다', () => {
      const html = App({
        products: [MOCK_PRODUCT_1, MOCK_PRODUCT_2],
        carts: {
          items: [],
          selectedIds: [],
        },
        totalCartPrice: 0,
      });

      // 기본 구조가 포함되어야 함
      expect(html).toContain('쇼핑몰');
      expect(html).toContain('장바구니');

      // 상품들이 렌더링되어야 함
      expect(html).toContain('상품1');
      expect(html).toContain('상품2');

      // 전체 선택 체크박스가 없어야 함 (장바구니가 비어있으므로)
      expect(html).not.toContain('select-all-cart');

      // 총 가격이 0원이어야 함
      expect(html).toContain('0원');
    });

    test('장바구니에 아이템이 있을 때 올바르게 렌더링된다', () => {
      const cartItems: CartWithProduct[] = [
        {
          id: '1',
          quantity: 1,
          image: 'image1.jpg',
          name: '상품1',
          price: 10000,
          selected: true,
          subtotal: 10000,
        },
        {
          id: '2',
          quantity: 2,
          image: 'image2.jpg',
          name: '상품2',
          price: 20000,
          selected: true,
          subtotal: 40000,
        },
      ];

      const html = App({
        products: [MOCK_PRODUCT_1, MOCK_PRODUCT_2],
        carts: {
          items: cartItems,
          selectedIds: ['1', '2'],
        },
        totalCartPrice: 50000,
      });

      // 전체 선택 체크박스가 있어야 함
      expect(html).toContain('select-all-cart');
      expect(html).toContain('checked'); // 모든 아이템이 선택되었으므로

      // 장바구니 아이템들이 렌더링되어야 함
      expect(html).toContain('data-product-id="1"');
      expect(html).toContain('data-product-id="2"');

      // 총 가격이 올바르게 표시되어야 함
      expect(html).toContain('50,000원');

      // 선택 삭제 버튼이 활성화되어야 함
      expect(html).toContain('bg-orange-500');
    });

    test('일부 아이템만 선택된 경우 올바르게 렌더링된다', () => {
      const cartItems: CartWithProduct[] = [
        {
          id: '1',
          quantity: 1,
          image: 'image1.jpg',
          name: '상품1',
          price: 10000,
          selected: true,
          subtotal: 10000,
        },
        {
          id: '2',
          quantity: 2,
          image: 'image2.jpg',
          name: '상품2',
          price: 20000,
          selected: false,
          subtotal: 40000,
        },
      ];

      const html = App({
        products: [MOCK_PRODUCT_1, MOCK_PRODUCT_2],
        carts: {
          items: cartItems,
          selectedIds: ['1'],
        },
        totalCartPrice: 50000,
      });

      // 전체 선택 체크박스가 있지만 체크되지 않아야 함
      expect(html).toContain('select-all-cart');
      expect(html).not.toMatch(/<input[^>]*id="select-all-cart"[^>]*checked/);

      // 선택 삭제 버튼이 활성화되어야 함 (일부 아이템이 선택되었으므로)
      expect(html).toContain('bg-orange-500');
    });
  });
});

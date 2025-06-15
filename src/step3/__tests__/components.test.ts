import { describe, expect, test } from 'vitest';
import { ProductItem, CartItem, CartSummary, App } from '../components';
import { type CartWithProduct, type Product } from '../domains';

describe('Components > ', () => {
  // 테스트용 상품 데이터
  const mockProduct: Product = {
    id: '1',
    name: '테스트 상품',
    price: 10000,
    image: 'test-image.jpg',
  };

  // 테스트용 장바구니 상품 데이터
  const mockCartItem: CartWithProduct = {
    ...mockProduct,
    quantity: 2,
    subtotal: 20000,
  };

  describe('ProductItem', () => {
    test('상품 정보가 올바르게 렌더링된다', () => {
      const html = ProductItem(mockProduct);

      // 필수 정보 포함 확인
      expect(html).toContain(mockProduct.name);
      expect(html).toContain('10,000원'); // 가격이 포맷팅되어 표시
      expect(html).toContain(`src="${mockProduct.image}"`);
      expect(html).toContain(`data-product-id="${mockProduct.id}"`);
      expect(html).toContain('장바구니 담기');
    });
  });

  describe('CartItem', () => {
    test('장바구니 상품 정보가 올바르게 렌더링된다', () => {
      const html = CartItem(mockCartItem);

      // 필수 정보 포함 확인
      expect(html).toContain(mockCartItem.name);
      expect(html).toContain('10,000원'); // 가격이 포맷팅되어 표시
      expect(html).toContain(`src="${mockCartItem.image}"`);
      expect(html).toContain(`data-product-id="${mockCartItem.id}"`);
      expect(html).toContain(
        `<span class="quantity">${mockCartItem.quantity}</span>`
      );
      expect(html).toContain('삭제');
    });
  });

  describe('CartSummary', () => {
    test('총 합계가 올바르게 표시된다', () => {
      const totalPrice = 35000;
      const html = CartSummary({ totalPrice });

      expect(html).toContain('총 합계:');
      expect(html).toContain('35,000원'); // 가격이 포맷팅되어 표시
      expect(html).toContain('장바구니 비우기');
    });
  });

  describe('App', () => {
    test('전체 애플리케이션이 올바르게 렌더링된다', () => {
      const products: Product[] = [mockProduct];
      const carts: CartWithProduct[] = [mockCartItem];
      const totalCartPrice = 20000;

      const html = App({ products, carts, totalCartPrice });

      // 각 섹션이 존재하는지 확인
      expect(html).toContain('쇼핑몰');
      expect(html).toContain('id="product-list"');
      expect(html).toContain('id="cart-items"');
      expect(html).toContain('20,000원'); // 총 합계 가격

      // 각 컴포넌트의 결과물이 포함되었는지 확인
      expect(html).toContain(mockProduct.name);
      expect(html).toContain(`data-product-id="${mockProduct.id}"`);
      expect(html).toContain('장바구니 비우기');
    });

    test('상품이나 장바구니가 비어있는 경우에도 렌더링된다', () => {
      const html = App({ products: [], carts: [], totalCartPrice: 0 });

      expect(html).toContain('쇼핑몰');
      expect(html).toContain('id="product-list"');
      expect(html).toContain('id="cart-items"');
      expect(html).toContain('0원'); // 총 합계 가격
    });
  });
});

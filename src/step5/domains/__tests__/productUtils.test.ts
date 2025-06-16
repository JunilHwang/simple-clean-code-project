import { describe, expect, test } from 'vitest';
import { productUtils } from '../productUtils.ts';
import {
  MOCK_PRODUCT_1,
  MOCK_PRODUCT_2,
  MOCK_PRODUCT_3,
  MOCK_PRODUCT_OUT_OF_STOCK,
  MOCK_PRODUCTS_MAP,
} from '../../dummies.ts';

describe('productUtils > ', () => {
  describe('getFilteredItems', () => {
    test('검색어가 없으면 전체 상품을 반환한다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {});
      expect(result).toHaveLength(4);
      expect(result).toEqual(
        expect.arrayContaining([
          MOCK_PRODUCT_1,
          MOCK_PRODUCT_2,
          MOCK_PRODUCT_3,
          MOCK_PRODUCT_OUT_OF_STOCK,
        ])
      );
    });

    test('검색어로 상품을 필터링할 수 있다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        searchKey: '상품1',
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([MOCK_PRODUCT_1, MOCK_PRODUCT_3])
      );
    });

    test('검색어는 대소문자를 구분하지 않는다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        searchKey: '상품1',
      });
      expect(result).toHaveLength(2);
    });

    test('이름순으로 정렬할 수 있다 (오름차순)', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        sortBy: 'name',
        orderBy: 'asc',
      });
      expect(result[0]).toEqual(MOCK_PRODUCT_1);
      expect(result[1]).toEqual(MOCK_PRODUCT_3);
      expect(result[2]).toEqual(MOCK_PRODUCT_2);
      expect(result[3]).toEqual(MOCK_PRODUCT_OUT_OF_STOCK);
    });

    test('이름순으로 정렬할 수 있다 (내림차순)', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        sortBy: 'name',
        orderBy: 'desc',
      });
      expect(result[0]).toEqual(MOCK_PRODUCT_OUT_OF_STOCK);
      expect(result[1]).toEqual(MOCK_PRODUCT_2);
      expect(result[2]).toEqual(MOCK_PRODUCT_3);
      expect(result[3]).toEqual(MOCK_PRODUCT_1);
    });

    test('가격순으로 정렬할 수 있다 (오름차순)', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        sortBy: 'price',
        orderBy: 'asc',
      });
      expect(result[0]).toEqual(MOCK_PRODUCT_3); // 500원
      expect(result[1]).toEqual(MOCK_PRODUCT_1); // 10000원
      expect(result[2]).toEqual(MOCK_PRODUCT_OUT_OF_STOCK); // 15000원
      expect(result[3]).toEqual(MOCK_PRODUCT_2); // 20000원
    });

    test('가격순으로 정렬할 수 있다 (내림차순)', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        sortBy: 'price',
        orderBy: 'desc',
      });
      expect(result[0]).toEqual(MOCK_PRODUCT_2); // 20000원
      expect(result[1]).toEqual(MOCK_PRODUCT_OUT_OF_STOCK); // 15000원
      expect(result[2]).toEqual(MOCK_PRODUCT_1); // 10000원
      expect(result[3]).toEqual(MOCK_PRODUCT_3); // 500원
    });

    test('검색과 정렬을 동시에 적용할 수 있다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        searchKey: '상품1',
        sortBy: 'price',
        orderBy: 'asc',
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(MOCK_PRODUCT_3); // 500원
      expect(result[1]).toEqual(MOCK_PRODUCT_1); // 10000원
    });

    test('빈 검색어는 전체 상품을 반환한다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        searchKey: '',
      });
      expect(result).toHaveLength(4);
    });

    test('공백만 있는 검색어는 전체 상품을 반환한다', () => {
      const result = productUtils.getFilteredItems(MOCK_PRODUCTS_MAP, {
        searchKey: '   ',
      });
      expect(result).toHaveLength(4);
    });
  });

  describe('isOutOfStock', () => {
    test('재고가 0인 상품은 품절 상태이다', () => {
      expect(productUtils.isOutOfStock(MOCK_PRODUCT_OUT_OF_STOCK)).toBe(true);
    });

    test('재고가 있는 상품은 품절 상태가 아니다', () => {
      expect(productUtils.isOutOfStock(MOCK_PRODUCT_1)).toBe(false);
      expect(productUtils.isOutOfStock(MOCK_PRODUCT_2)).toBe(false);
      expect(productUtils.isOutOfStock(MOCK_PRODUCT_3)).toBe(false);
    });
  });
});

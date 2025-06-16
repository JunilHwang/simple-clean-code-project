import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useProducts } from '../useProducts.ts';
import {
  MOCK_PRODUCT_1,
  MOCK_PRODUCT_2,
  MOCK_PRODUCT_3,
  MOCK_PRODUCTS,
} from '../../dummies.ts';

describe('useProducts > ', () => {
  test('초기 상품 목록을 올바르게 설정한다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    expect(Object.keys(result.current.items)).toHaveLength(4);
    expect(result.current.items['1']).toEqual(MOCK_PRODUCT_1);
    expect(result.current.items['2']).toEqual(MOCK_PRODUCT_2);
  });

  test('기본값으로 INITIAL_PRODUCTS를 사용한다', () => {
    const { result } = renderHook(() => useProducts());

    expect(Object.keys(result.current.items)).toHaveLength(10); // INITIAL_PRODUCTS 개수
  });

  test('초기 상태에서는 모든 상품이 필터링 결과에 포함된다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    expect(result.current.filteredItems).toHaveLength(4);
  });

  test('검색 옵션을 변경할 수 있다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    act(() => {
      result.current.changeOptions({ searchKey: '상품1' });
    });

    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filteredItems).toEqual(
      expect.arrayContaining([MOCK_PRODUCT_1, MOCK_PRODUCT_3])
    );
  });

  test('정렬 옵션을 변경할 수 있다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    act(() => {
      result.current.changeOptions({ sortBy: 'price', orderBy: 'asc' });
    });

    expect(result.current.filteredItems[0]).toEqual(MOCK_PRODUCT_3); // 가장 저렴한 상품
  });

  test('여러 옵션을 동시에 변경할 수 있다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    act(() => {
      result.current.changeOptions({
        searchKey: '상품1',
        sortBy: 'price',
        orderBy: 'desc',
      });
    });

    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filteredItems[0]).toEqual(MOCK_PRODUCT_1); // 더 비싼 상품이 먼저
    expect(result.current.filteredItems[1]).toEqual(MOCK_PRODUCT_3);
  });

  test('부분 옵션 변경 시 기존 옵션은 유지된다', () => {
    const { result } = renderHook(() => useProducts(MOCK_PRODUCTS));

    act(() => {
      result.current.changeOptions({ searchKey: '상품1' });
    });

    act(() => {
      result.current.changeOptions({ sortBy: 'price' });
    });

    // 검색어는 유지되면서 정렬만 변경
    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filteredItems[0]).toEqual(MOCK_PRODUCT_3); // 가격순 정렬
  });
});

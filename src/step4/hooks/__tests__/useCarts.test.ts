import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useCarts } from '../useCarts.ts';
import { MOCK_PRODUCTS_MAP } from '../../dummies.ts';

describe('useCarts > ', () => {
  test('초기 상태는 빈 장바구니이다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    expect(result.current.items).toEqual({});
    expect(result.current.itemsWithProduct).toEqual([]);
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.allSelected).toBe(false);
  });

  test('상품을 장바구니에 추가할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
    });

    expect(result.current.items['1']).toEqual({
      productId: '1',
      quantity: 1,
      selected: false,
    });
    expect(result.current.totalPrice).toBe(10000);
  });

  test('이미 담긴 상품을 다시 추가하면 수량이 증가한다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('1');
    });

    expect(result.current.items['1'].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(20000);
  });

  test('재고보다 많이 담을 수 없다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1'); // 재고 2개
      result.current.add('1');
      result.current.add('1'); // 3번째 시도
    });

    expect(result.current.items['1'].quantity).toBe(2); // 재고 한계
  });

  test('품절 상품은 추가할 수 없다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('4'); // 품절상품
    });

    expect(result.current.items['4']).toBeUndefined();
  });

  test('상품 수량을 직접 변경할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('2');
      result.current.updateQuantity('2', 2);
    });

    expect(result.current.items['2'].quantity).toBe(3);
  });

  test('상품을 장바구니에서 제거할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.remove('1');
    });

    expect(result.current.items['1']).toBeUndefined();
    expect(result.current.items['2']).toBeDefined();
  });

  test('장바구니를 완전히 비울 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.clear();
    });

    expect(result.current.items).toEqual({});
    expect(result.current.totalPrice).toBe(0);
  });

  test('상품 선택/해제를 토글할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.toggleSelect('1');
    });

    expect(result.current.items['1'].selected).toBe(true);
    expect(result.current.selectedItems).toHaveLength(1);

    act(() => {
      result.current.toggleSelect('1');
    });

    expect(result.current.items['1'].selected).toBe(false);
    expect(result.current.selectedItems).toHaveLength(0);
  });

  test('전체 선택/해제를 토글할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
    });

    expect(result.current.allSelected).toBe(false);

    act(() => {
      result.current.toggleAllSelected();
    });

    expect(result.current.allSelected).toBe(true);
    expect(result.current.selectedItems).toHaveLength(2);

    act(() => {
      result.current.toggleAllSelected();
    });

    expect(result.current.allSelected).toBe(false);
    expect(result.current.selectedItems).toHaveLength(0);
  });

  test('선택된 상품들을 삭제할 수 있다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.toggleSelect('1');
    });

    act(() => {
      result.current.removeSelected();
    });

    expect(result.current.items['1']).toBeUndefined();
    expect(result.current.items['2']).toBeDefined();
  });

  test('itemsWithProduct는 상품 정보와 장바구니 정보를 결합한다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.toggleSelect('1');
    });

    expect(result.current.itemsWithProduct).toEqual([
      {
        id: '1',
        name: '상품1',
        price: 10000,
        image: 'image1.jpg',
        quantity: 1,
        selected: true,
        subtotal: 10000,
      },
      {
        id: '2',
        name: '상품2',
        price: 20000,
        image: 'image2.jpg',
        quantity: 1,
        selected: false,
        subtotal: 20000,
      },
    ]);
  });

  test('총 가격이 올바르게 계산된다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1'); // 10000원
      result.current.add('1'); // 20000원
      result.current.add('2'); // 20000원
    });

    expect(result.current.totalPrice).toBe(40000);
  });

  test('빈 장바구니에서 allSelected는 false이다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    expect(result.current.allSelected).toBe(false);
  });

  test('모든 상품이 선택되면 allSelected는 true이다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.toggleSelect('1');
      result.current.toggleSelect('2');
    });

    expect(result.current.allSelected).toBe(true);
  });

  test('일부 상품만 선택되면 allSelected는 false이다', () => {
    const { result } = renderHook(() => useCarts(MOCK_PRODUCTS_MAP));

    act(() => {
      result.current.add('1');
      result.current.add('2');
      result.current.toggleSelect('1');
    });

    expect(result.current.allSelected).toBe(false);
  });
});

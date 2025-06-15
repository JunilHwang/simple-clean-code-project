import type { CartWithProduct, Product } from './domains/types.ts';
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useState,
} from 'react';
import type { ProductOptions } from './domains/constants.ts';

export function ProductItem({
  id,
  image,
  name,
  price,
  quantity,
  onCartAddClick,
}: Product & { onCartAddClick?: (id: string) => void }) {
  const disabled = quantity === 0;

  return (
    <div
      className="bg-white p-4 rounded-lg shadow product-item"
      data-product-id={id}
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className={`w-full h-48 object-cover mb-4 rounded ${disabled ? 'opacity-50' : ''}`}
        />
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded text-white font-bold">
            품절
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-2">{price.toLocaleString()}원</p>
      <p className="text-sm text-gray-500 mb-4">재고: {quantity}개</p>
      <button
        className={`w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded add-to-cart-btn`}
        data-product-id={id}
        disabled={disabled}
        onClick={() => onCartAddClick?.(id)}
      >
        {disabled ? '품절' : '장바구니 담기'}
      </button>
    </div>
  );
}

export function CartItem({
  id,
  quantity,
  image,
  name,
  price,
  selected,
  subtotal,
  onIncrementClick,
  onDecrementClick,
  onRemoveClick,
  onSelect,
}: CartWithProduct & {
  onIncrementClick?: (id: string) => void;
  onDecrementClick?: (id: string) => void;
  onRemoveClick?: (id: string) => void;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className="cart-item flex items-center gap-3 p-3 border-t"
      data-product-id={id}
    >
      <input
        type="checkbox"
        className="cart-item-checkbox"
        data-product-id={id}
        checked={selected}
        onChange={() => onSelect?.(id)}
        readOnly
      />
      <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-gray-600 text-sm">
          {price.toLocaleString()}원 * {quantity.toLocaleString()}개 ={' '}
          {subtotal.toLocaleString()}원
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            className="decrease-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm"
            onClick={() => onDecrementClick?.(id)}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button
            className="increase-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm"
            onClick={() => onIncrementClick?.(id)}
          >
            +
          </button>
          <button
            className="remove-btn bg-red-500 text-white px-2 py-1 rounded text-xs ml-2"
            onClick={() => onRemoveClick?.(id)}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartSummary({
  totalPrice,
  selection,
  onRemoveSelectedClick,
  onClearCartClick,
}: {
  totalPrice: number;
  selection: boolean;
  onRemoveSelectedClick?: () => void;
  onClearCartClick?: () => void;
}) {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold">총 합계:</span>
        <span id="total-price" className="text-xl font-bold text-blue-600">
          {totalPrice.toLocaleString()}원
        </span>
      </div>
      <div className="flex gap-2">
        <button
          id="remove-selected-cart"
          className={`flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded`}
          disabled={!selection}
          onClick={onRemoveSelectedClick}
        >
          선택 삭제
        </button>
        <button
          id="clear-cart"
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={onClearCartClick}
        >
          전체 비우기
        </button>
      </div>
    </div>
  );
}

export function ProductControls({
  onInputEnterKeyDown,
  onOrderChange,
  onSortChange,
}: {
  onInputEnterKeyDown?: (value: string) => void;
  onOrderChange?: (value: ProductOptions['orderBy']) => void;
  onSortChange?: (value: ProductOptions['sortBy']) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === 'Enter') {
      onInputEnterKeyDown?.(searchQuery);
    }
  };

  const handleOrderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as 'asc' | 'desc';
    onOrderChange?.(value);
  };

  const handleSortChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as 'price' | 'name' | 'default';
    onSortChange?.(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* 검색 */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            id="search-input"
            placeholder="상품명으로 검색..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={handleInputEnterKeyDown}
          />
        </div>

        {/* 정렬 */}
        <div className="flex gap-2">
          <select
            id="sort-select"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleOrderChange}
          >
            <option value="default">기본순</option>
            <option value="name">이름순</option>
            <option value="price">가격순</option>
          </select>

          <select
            id="order-select"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSortChange}
          >
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>
    </div>
  );
}

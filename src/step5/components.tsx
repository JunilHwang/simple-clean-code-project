import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  memo,
} from 'react';
import {
  useAddToCart,
  useCartAllSelected,
  useCartIds,
  useCartItemWithProduct,
  useCartSelection,
  useCartTotalPrice,
  useClearCart,
  useIncrementCartQuantity,
  useRemoveFromCart,
  useRemoveSelectedCarts,
  useToggleAllCartsSelected,
  useToggleCartSelect,
} from './hooks/useCarts.ts';
import {
  useChangeProductOptions,
  useFilteredProducts,
  useProduct,
  useProductOptions,
} from './hooks/useProducts.ts';

const ProductItem = memo(({ id }: { id: string }) => {
  const { name, image, price, quantity } = useProduct(id);
  const addToCart = useAddToCart();
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
        onClick={() => addToCart(id)}
      >
        {disabled ? '품절' : '장바구니 담기'}
      </button>
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

export function ProductList() {
  const products = useFilteredProducts();
  return (
    <div
      id="product-list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {products.map((product) => (
        <ProductItem key={product.id} id={product.id} />
      ))}
    </div>
  );
}

export const CartItem = memo(({ id }: { id: string }) => {
  const { selected, price, image, quantity, subtotal, name } =
    useCartItemWithProduct(id);
  const select = useToggleCartSelect();
  const incrementQuantity = useIncrementCartQuantity();
  const remove = useRemoveFromCart();
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
        onChange={() => select(id)}
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
            onClick={() => incrementQuantity(id, -1)}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button
            className="increase-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm"
            onClick={() => incrementQuantity(id, 1)}
          >
            +
          </button>
          <button
            className="remove-btn bg-red-500 text-white px-2 py-1 rounded text-xs ml-2"
            onClick={() => remove(id)}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
});

export function CartCheckboxAll() {
  const allSelected = useCartAllSelected();
  const toggleAllSelected = useToggleAllCartsSelected();
  return (
    <div className="flex gap-2 mb-2 ml-3">
      <input
        type="checkbox"
        id="select-all-cart"
        checked={allSelected}
        onChange={toggleAllSelected}
        readOnly
      />
    </div>
  );
}

export function CartItemList() {
  const cartIds = useCartIds();
  return (
    <div id="cart-items">
      {cartIds.length > 0 && <CartCheckboxAll />}
      {cartIds.map((id) => (
        <CartItem key={id} id={id} />
      ))}
    </div>
  );
}

CartItem.displayName = 'CartItem';

export function CartSummary() {
  const totalPrice = useCartTotalPrice();
  const selection = useCartSelection();
  const removeSelected = useRemoveSelectedCarts();
  const clear = useClearCart();
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
          onClick={removeSelected}
        >
          선택 삭제
        </button>
        <button
          id="clear-cart"
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={clear}
        >
          전체 비우기
        </button>
      </div>
    </div>
  );
}

export function ProductControls() {
  const options = useProductOptions();
  const changeOptions = useChangeProductOptions();

  const handleInputEnterKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === 'Enter') {
      changeOptions({ searchKey: e.currentTarget.value });
    }
  };

  const handleOrderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const orderBy = e.target.value as 'asc' | 'desc';
    changeOptions({ orderBy });
  };

  const handleSortChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const sortBy = e.target.value as 'price' | 'name' | 'default';
    changeOptions({ sortBy });
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
            onKeyDown={handleInputEnterKeyDown}
          />
        </div>

        {/* 정렬 */}
        <div className="flex gap-2">
          <select
            id="sort-select"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSortChange}
          >
            <option
              value="default"
              defaultChecked={options.sortBy === 'default'}
            >
              기본순
            </option>
            <option value="name" defaultChecked={options.sortBy === 'name'}>
              이름순
            </option>
            <option value="price" defaultChecked={options.sortBy === 'price'}>
              가격순
            </option>
          </select>

          <select
            id="order-select"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleOrderChange}
          >
            <option value="asc" defaultChecked={options.orderBy === 'asc'}>
              오름차순
            </option>
            <option value="desc" defaultChecked={options.orderBy === 'desc'}>
              내림차순
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

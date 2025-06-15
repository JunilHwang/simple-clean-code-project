import { type CartWithProduct, type Product } from './domains';

export function ProductItem({ image, name, price, id, quantity }: Product) {
  const disabled = quantity === 0;

  return `
    <div class="bg-white p-4 rounded-lg shadow product-item" data-product-id="${id}">
      <div class="relative">
        <img src="${image}" alt="${name}" class="w-full h-48 object-cover mb-4 rounded ${disabled ? 'opacity-50' : ''}">
        ${disabled ? '<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded text-white font-bold">품절</div>' : ''}
      </div>
      <h3 class="text-lg font-bold mb-2">${name}</h3>
      <p class="text-gray-600 mb-2">${price.toLocaleString()}원</p>
      <p class="text-sm text-gray-500 mb-4">재고: ${quantity}개</p>
      <button class="w-full ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded add-to-cart-btn" data-product-id="${id}" ${disabled ? 'disabled' : ''}>
        ${disabled ? '품절' : '장바구니 담기'}
      </button>
    </div>
  `;
}

export function CartItem({
  id,
  quantity,
  image,
  name,
  price,
  selected,
  subtotal,
}: CartWithProduct) {
  return `
    <div class="cart-item flex items-center gap-3 p-3 border-t" data-product-id="${id}">
      <input type="checkbox" class="cart-item-checkbox" data-product-id="${id}" ${selected ? 'checked' : ''}>
      <img src="${image}" alt="${name}" class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <h4 class="font-bold text-sm">${name}</h4>
        <p class="text-gray-600 text-sm">
          ${price.toLocaleString()}원 * ${quantity.toLocaleString()}개 = ${subtotal.toLocaleString()}원
        </p>
        <div class="flex items-center gap-2 mt-2">
          <button class="decrease-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">-</button>
          <span class="quantity">${quantity}</span>
          <button class="increase-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">+</button>
          <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">삭제</button>
        </div>
      </div>
    </div>
  `;
}

export function CartSummary({
  totalPrice,
  selection,
}: {
  totalPrice: number;
  selection: boolean;
}) {
  return `
    <div class="mt-4 pt-4 border-t">
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-bold">총 합계:</span>
        <span id="total-price" class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
      </div>
      <div class="flex gap-2">
        <button id="remove-selected-cart" class="flex-1 ${selection ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white py-2 px-4 rounded" ${!selection ? 'disabled' : ''}>
          선택 삭제
        </button>
        <button id="clear-cart" class="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          전체 비우기
        </button>
      </div>
    </div>
  `;
}

export function ProductControls() {
  return `
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- 검색 -->
        <div class="flex-1 min-w-64">
          <input 
            type="text" 
            id="search-input" 
            placeholder="상품명으로 검색..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <!-- 정렬 -->
        <div class="flex gap-2">
          <select id="sort-select" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="default">기본순</option>
            <option value="name">이름순</option>
            <option value="price">가격순</option>
          </select>
          
          <select id="order-select" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

export function App({
  products,
  carts,
  totalCartPrice,
}: {
  products: Product[];
  carts: {
    items: CartWithProduct[];
    selectedIds: Product['id'][];
  };
  totalCartPrice: number;
}) {
  const selection = carts.selectedIds.length > 0;
  const allSelected = carts.items.length === carts.selectedIds.length;

  return `
    <div class="container mx-auto py-20">
      <h1 class="text-3xl font-bold mb-8 text-center">쇼핑몰</h1>
    
      <div class="flex gap-8">
        <div class="flex-1">
          ${ProductControls()}
          <div id="product-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${products.map(ProductItem).join('')}
          </div>
        </div>
    
        <!-- 장바구니 -->
        <div class="bg-white p-6 rounded-lg shadow w-[400px]">
          <h2 class="text-2xl font-bold mb-4">장바구니</h2>
          <div id="cart-items">
            ${
              carts.items.length > 0
                ? `
              <div class="flex gap-2 mb-2 ml-3">
                <input type="checkbox" id="select-all-cart" ${allSelected ? 'checked' : ''} />
              </div>
            `
                : ''
            }
            ${carts.items.map(CartItem).join('')}
          </div>
          ${CartSummary({ totalPrice: totalCartPrice, selection })}
        </div>
      </div>
    </div>
  `;
}

import { type CartWithProduct, type Product } from './domains';

export function ProductItem({ image, name, price, id }: Product) {
  return `
    <div class="bg-white p-4 rounded-lg shadow">
      <img src="${image}" alt="${name}" class="w-full h-48 object-cover mb-4 rounded">
      <h3 class="text-lg font-bold mb-2">${name}</h3>
      <p class="text-gray-600 mb-4">${price.toLocaleString()}원</p>
      <button class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 add-to-cart-btn" data-product-id="${id}">
        장바구니 담기
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
  subtotal,
}: CartWithProduct) {
  return `
    <div class="cart-item flex items-center gap-3 p-3 border-t" data-product-id="${id}">
      <img src="${image}" alt="${name}" class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <h4 class="font-bold text-sm">${name}</h4>
        <p class="text-gray-600 text-sm">${price.toLocaleString()}원</p>
        <div class="flex items-center gap-2 mt-2">
          <button class="decrease-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">-</button>
          <span class="quantity">${quantity}</span>
          <button class="increase-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">+</button>
          <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">삭제</button>
        </div>
      </div>
      <div class="text-right">
        <span class="subtotal font-bold">${subtotal.toLocaleString()}원</span>
      </div>
    </div>
  `;
}

export function CartSummary({ totalPrice }: { totalPrice: number }) {
  return `
    <div class="mt-4 pt-4 border-t">
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-bold">총 합계:</span>
        <span id="total-price" class="text-xl font-bold text-blue-600">${totalPrice.toLocaleString()}원</span>
      </div>
      <button id="clear-cart" class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
        장바구니 비우기
      </button>
    </div>
  `;
}

export function App({
  products,
  carts,
  totalCartPrice,
}: {
  products: Product[];
  carts: CartWithProduct[];
  totalCartPrice: number;
}) {
  return `
	  <div class="container mx-auto py-20">
		  <h1 class="text-3xl font-bold mb-8 text-center">쇼핑몰</h1>
		
		  <div class="flex gap-8">
		    <div class="flex-1">
		      <div id="product-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		        ${products.map(ProductItem).join('')}
		      </div>
		    </div>
		
		    <!-- 장바구니 -->
		    <div class="bg-white p-6 rounded-lg shadow w-[400px]">
		      <h2 class="text-2xl fon t-bold mb-4">장바구니</h2>
		      <div id="cart-items">
		        ${carts.map(CartItem).join('')}
		      </div>
		      ${CartSummary({ totalPrice: totalCartPrice })}
		    </div>
		  </div>
		</div>
  `;
}

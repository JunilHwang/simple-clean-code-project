// 1단계: 상태와 상태를 변경하는 함수 정의하기

// 타입 정의
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Cart {
  productId: string;
  quantity: number;
}

// 초기 상품 데이터
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '맥북 프로 14인치',
    price: 2_990_000,
    image: 'https://picsum.photos/id/1/200.webp',
  },
  {
    id: '2',
    name: '아이폰 15 Pro',
    price: 1_550_000,
    image: 'https://picsum.photos/id/2/200.webp',
  },
  {
    id: '3',
    name: '갤럭시 S24',
    price: 1_200_000,
    image: 'https://picsum.photos/id/3/200.webp',
  },
  {
    id: '4',
    name: '에어팟 프로',
    price: 350_000,
    image: 'https://picsum.photos/id/4/200.webp',
  },
  {
    id: '5',
    name: '맥북 에어',
    price: 1_590_000,
    image: 'https://picsum.photos/id/5/200.webp',
  },
  {
    id: '6',
    name: '아이패드 프로',
    price: 1_490_000,
    image: 'https://picsum.photos/id/6/200.webp',
  },
  {
    id: '7',
    name: '삼성 모니터',
    price: 450_000,
    image: 'https://picsum.photos/id/7/200.webp',
  },
  {
    id: '8',
    name: '무선 키보드',
    price: 120_000,
    image: 'https://picsum.photos/id/8/200.webp',
  },
  {
    id: '9',
    name: '무선 마우스',
    price: 80_000,
    image: 'https://picsum.photos/id/9/200.webp',
  },
  {
    id: '10',
    name: '스피커',
    price: 250_000,
    image: 'https://picsum.photos/id/10/200.webp',
  },
];

const createCarts = (initValue: Record<Product['id'], Cart> = {}) => {
  let value = initValue;

  return {
    get value() {
      return value;
    },
    get items(): Cart[] {
      return Object.values(value);
    },
    add(productId: string) {
      if (!value[productId]) {
        value[productId] = { productId, quantity: 0 };
      }
      value[productId].quantity += 1;
    },
    update(productId: string, quantity: number) {
      if (!value[productId]) {
        value[productId] = { productId, quantity: 1 };
      }
      value[productId].quantity = Math.max(quantity, 1);
    },
    remove(productId: string) {
      if (value[productId]) {
        delete value[productId];
      }
    },
    clear() {
      value = {};
    },
  };
};

const createProducts = (initValue = INITIAL_PRODUCTS) => {
  // product도 valueMap 형태로 관리하면 편할 것 같다.
  const value: Record<Product['id'], Product> = initValue.reduce((acc, product) => ({
    ...acc,
    [product.id]: product,
  }), {});

  return {
    get value() {
      return Object.freeze(value);
    },
    get items() {
      return Object.values(value);
    },

    // productId를 통해 가져오는 함수를 하나 만들었다.
    get: (id: string) => value[id],
  };
};

// 애플리케이션 상태
const store = {
  products: createProducts(),
  carts: createCarts(),

  get totalCartPrice() {
    return this.carts.items.reduce((total, item) => {
      const product = this.products.get(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  },

  get cartsWithProduct() {
    return this.carts.items.map(({ productId, quantity }) => {
      const product = this.products.value[productId];
      return {
        ...product,
        quantity,
        subtotal: product.price * quantity,
      };
    });
  },
};

function ProductItem({ image, name, price, id }: Product) {
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

function CartItem({ id, quantity, image, name, price }: typeof store.cartsWithProduct[number]) {
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
        <span class="subtotal font-bold">${price.toLocaleString()}원</span>
      </div>
    </div>
  `;
}

function CartSummary({ totalPrice }: { totalPrice: number }) {
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

function App() {
  return `
	  <div class="container mx-auto py-20">
		  <h1 class="text-3xl font-bold mb-8 text-center">쇼핑몰</h1>
		
		  <div class="flex gap-8">
		    <div class="flex-1">
		      <div id="product-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		        ${store.products.items.map(ProductItem).join('')}
		      </div>
		    </div>
		
		    <!-- 장바구니 -->
		    <div class="bg-white p-6 rounded-lg shadow w-[400px]">
		      <h2 class="text-2xl font-bold mb-4">장바구니</h2>
		      <div id="cart-items">
		        ${store.cartsWithProduct.map(CartItem).join('')}
		      </div>
		      ${CartSummary({ totalPrice: store.totalCartPrice })}
		    </div>
		  </div>
		</div>
  `;
}

function addEvent(eventType: string, selector: string, callback: (event: Event) => void, parent = document) {
  parent.addEventListener(eventType, event => {
    const target = event.target as HTMLElement;
    if (target.closest(selector)) {
      callback(event);
    }
  });
}

const setupEvents = (() => {
  let initialized = false;
  return (setup: () => void) => {
    if (!initialized) {
      setup();
      initialized = true;
    }
  }
})();

function render() {
  const $root = document.getElementById('root');
  if ($root) {
    $root.innerHTML = App();
  }

  setupEvents(() => {
    // 1. 상품목록에서 “장바구니 담기” 버튼을 클릭할 때
    addEvent('click', '.add-to-cart-btn', (event) => {
      const target = event.target as HTMLElement;
      const productId = target.getAttribute('data-product-id');
      if (productId) {
        store.carts.add(productId);
        render();
      }
    });


    // 2. 장바구니에서 +, - 버튼을 클릭할 때
    addEvent('click', '.increase-btn, .decrease-btn', (event) => {
      const target = event.target as HTMLElement;
      const cartItemEl = target.closest('.cart-item');
      const productId = cartItemEl?.getAttribute('data-product-id');
      if (!productId || !cartItemEl) {
        return;
      }

      const quantity = store.carts.value[productId]?.quantity || 0;
      const nextQuantity = quantity + (target.classList.contains('increase-btn') ? 1 : -1);

      store.carts.update(productId, nextQuantity);
      render();
    });

    // 3. 장바구니에서 ‘삭제” 버튼을 클리할 때
    addEvent('click', '.remove-btn', (event) => {
      const target = event.target as HTMLElement;
      const cartItemEl = target.closest('.cart-item');
      if (cartItemEl) {
        const productId = cartItemEl.getAttribute('data-product-id');
        if (productId) {
          store.carts.remove(productId);
          render();
        }
      }
    });

    // 4. 장바구니에서 “장바구니 비우기” 버튼을 클릭할 때
    addEvent('click', '#clear-cart', () => {
      store.carts.clear();
      render();
    });
  })
}

render();

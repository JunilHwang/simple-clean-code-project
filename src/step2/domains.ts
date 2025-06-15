export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Cart {
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
  const value: Record<Product['id'], Product> = initValue.reduce(
    (acc, product) => ({
      ...acc,
      [product.id]: product,
    }),
    {}
  );

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
export const store = {
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

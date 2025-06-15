export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  productId: string;
  quantity: number;
  selected: boolean;
}

export type CartWithProduct = Omit<Product, 'quantity'> &
  Pick<Cart, 'quantity' | 'selected'> & { subtotal: number };

// 초기 상품 데이터
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '맥북 프로 14인치',
    price: 2_990_000,
    image: 'https://picsum.photos/id/1/200.webp',
    quantity: 5,
  },
  {
    id: '2',
    name: '아이폰 15 Pro',
    price: 1_550_000,
    image: 'https://picsum.photos/id/2/200.webp',
    quantity: 10,
  },
  {
    id: '3',
    name: '갤럭시 S24',
    price: 1_200_000,
    image: 'https://picsum.photos/id/3/200.webp',
    quantity: 0,
  },
  {
    id: '4',
    name: '에어팟 프로',
    price: 350_000,
    image: 'https://picsum.photos/id/4/200.webp',
    quantity: 15,
  },
  {
    id: '5',
    name: '맥북 에어',
    price: 1_590_000,
    image: 'https://picsum.photos/id/5/200.webp',
    quantity: 3,
  },
  {
    id: '6',
    name: '아이패드 프로',
    price: 1_490_000,
    image: 'https://picsum.photos/id/6/200.webp',
    quantity: 7,
  },
  {
    id: '7',
    name: '삼성 모니터',
    price: 450_000,
    image: 'https://picsum.photos/id/7/200.webp',
    quantity: 2,
  },
  {
    id: '8',
    name: '무선 키보드',
    price: 120_000,
    image: 'https://picsum.photos/id/8/200.webp',
    quantity: 20,
  },
  {
    id: '9',
    name: '무선 마우스',
    price: 80_000,
    image: 'https://picsum.photos/id/9/200.webp',
    quantity: 25,
  },
  {
    id: '10',
    name: '스피커',
    price: 250_000,
    image: 'https://picsum.photos/id/10/200.webp',
    quantity: 8,
  },
];

const createCarts = (initValue: Record<Product['id'], Cart> = {}) => {
  let value = { ...initValue };

  const each = (callback: (item: Cart) => void) =>
    Object.values(value).forEach(callback);

  return {
    get value() {
      return value;
    },
    get items() {
      return Object.values(value);
    },
    get selectedItems() {
      return this.items.filter((item) => item.selected);
    },
    add(productId: string) {
      if (!value[productId]) {
        value[productId] = { productId, quantity: 0, selected: false };
      }
      value[productId].quantity += 1;
    },
    updateQuantity(productId: string, quantity: number) {
      value[productId].quantity = Math.max(quantity, 1);
    },
    remove(productId: string) {
      if (value[productId]) {
        delete value[productId];
      }
    },
    removeSelected() {
      this.selectedItems.forEach((item) => this.remove(item.productId));
    },
    toggleSelect(productId: string) {
      if (value[productId]) {
        value[productId].selected = !value[productId].selected;
      }
    },
    selectAll() {
      each((item) => Object.assign(item, { selected: true }));
    },
    deselectAll() {
      each((item) => Object.assign(item, { selected: false }));
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

  const options = {
    searchKey: '',
    orderBy: 'asc' as 'asc' | 'desc',
    sortBy: 'default' as 'name' | 'price' | 'default',
  };

  return {
    get value() {
      return Object.freeze(value);
    },
    get items() {
      return Object.values(value);
    },
    get filteredItems() {
      const { searchKey, orderBy, sortBy } = options;
      return this.items
        .filter((item) => {
          const lowerKeyword = searchKey.toLowerCase();
          return item.name.toLowerCase().includes(lowerKeyword);
        })
        .sort((a, b) => {
          if (sortBy === 'default') return 0;

          const comparison =
            sortBy === 'name'
              ? a.name.localeCompare(b.name)
              : a.price - b.price;

          return orderBy === 'asc' ? comparison : -comparison;
        });
    },
    isOutOfStock(productId: string) {
      return value[productId]?.quantity === 0;
    },
    search(searchKey: string) {
      options.searchKey = searchKey;
      return this.filteredItems;
    },
    sort({ sortBy = 'default', orderBy = 'asc' }: Partial<typeof options>) {
      Object.assign(options, { sortBy, orderBy });
      return this.filteredItems;
    },
  };
};

// 애플리케이션 상태
export const createStore = ({
  products: defaultProducts = INITIAL_PRODUCTS,
  carts: defaultCarts = {},
}: {
  products?: Product[];
  carts?: Record<Product['id'], Cart>;
}) => {
  const products = createProducts(defaultProducts);
  const carts = createCarts(defaultCarts);

  return {
    products,
    carts,
    get totalCartPrice() {
      return carts.items.reduce((total, item) => {
        const product = products.value[item.productId];
        return total + (product ? product.price * item.quantity : 0);
      }, 0);
    },
    get cartsWithProduct(): CartWithProduct[] {
      return carts.items.map(({ productId, quantity, selected }) => {
        const product = products.value[productId];
        return {
          ...product,
          quantity,
          selected,
          subtotal: product.price * quantity,
        };
      });
    },
    addToCart(id: string) {
      const cartQuantity = carts.value[id]?.quantity ?? 0;
      const productQuantity = products.value[id].quantity;
      if (products.isOutOfStock(id) || cartQuantity >= productQuantity) {
        return;
      }
      carts.add(id);
    },
    incrementCartQuantity(id: string, quantity: number) {
      const cartQuantity = carts.value[id].quantity;
      const productQuantity = products.value[id].quantity;
      carts.updateQuantity(
        id,
        Math.min(cartQuantity + quantity, productQuantity)
      );
    },
  };
};

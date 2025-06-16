import { create } from 'zustand';
import type {
  Carts,
  CartWithProduct,
  Product,
  Products,
} from '../domains/types';
import { cartUtils } from '../domains/cartUtils';
import { cartService } from '../domains/cartService';
import { productUtils } from '../domains/productUtils';
import {
  INITIAL_PRODUCT_OPTIONS,
  INITIAL_PRODUCTS,
  type ProductOptions,
} from '../domains/constants';
import { useShallow } from 'zustand/react/shallow';

// 유틸리티 함수: 배열을 맵으로 변환
const toMap = (arr: Product[]): Products =>
  arr.reduce((acc, product) => ({ ...acc, [product.id]: product }), {});

export interface StoreState {
  // Products 상태
  products: Products;
  productOptions: ProductOptions;

  // Carts 상태
  carts: Carts;

  // Computed values (getters)
  getFilteredProducts: () => Product[];
  getCartTotalPrice: () => number;
  getCartWithProduct: (id: string) => CartWithProduct;
  getCartsWithProduct: () => CartWithProduct[];
  getSelectedCartItems: () => CartWithProduct[];
  isAllCartsSelected: () => boolean;

  // Products 액션
  changeProductOptions: (newOptions: Partial<ProductOptions>) => void;

  // Carts 액션
  addToCart: (productId: string) => void;
  incrementCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  removeSelectedCarts: () => void;
  toggleCartSelect: (productId: string) => void;
  toggleAllCartsSelected: () => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // 초기 상태
  products: toMap(INITIAL_PRODUCTS),
  productOptions: INITIAL_PRODUCT_OPTIONS,
  carts: {},

  getFilteredProducts: () => {
    const { products, productOptions } = get();
    return productUtils.getFilteredItems(products, productOptions);
  },

  getCartTotalPrice: () => {
    const { carts, products } = get();
    return cartService.getTotalCartPrice(carts, products);
  },

  getCartWithProduct: (id) => {
    const { carts, products } = get();
    return cartService.getCartWithProduct(carts, products, id);
  },

  getCartsWithProduct: () => {
    const { carts, products } = get();
    return cartService.getCartsWithProduct(carts, products);
  },

  getSelectedCartItems: () => {
    return get()
      .getCartsWithProduct()
      .filter((item) => item.selected);
  },

  isAllCartsSelected: () => {
    const cartItems = get().getCartsWithProduct();
    const selectedItems = get().getSelectedCartItems();
    return (
      selectedItems.length > 0 && selectedItems.length === cartItems.length
    );
  },

  // Products 액션
  changeProductOptions: (newOptions) =>
    set(({ productOptions }) => ({
      productOptions: { ...productOptions, ...newOptions },
    })),

  // Carts 액션
  addToCart: (productId) =>
    set((state) => ({
      carts: cartService.addToCart(state.carts, state.products, productId),
    })),

  incrementCartQuantity: (productId, quantity) =>
    set((state) => ({
      carts: cartService.incrementCartQuantity(
        state.carts,
        state.products,
        productId,
        quantity
      ),
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      carts: cartUtils.remove(state.carts, productId),
    })),

  removeSelectedCarts: () =>
    set((state) => ({
      carts: cartUtils.removeSelected(state.carts),
    })),

  toggleCartSelect: (productId) =>
    set((state) => ({
      carts: cartUtils.toggleSelect(state.carts, productId),
    })),

  toggleAllCartsSelected: () =>
    set((state) => ({
      carts: cartUtils.updateAllSelected(
        state.carts,
        !get().isAllCartsSelected()
      ),
    })),

  clearCart: () => set({ carts: {} }),
}));

export const useShallowStore = <T>(callback: (state: StoreState) => T) =>
  useStore(useShallow(callback));

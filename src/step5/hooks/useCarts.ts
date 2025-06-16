import { useShallowStore as useStore } from './useStore.ts';

export const useCartIds = () => useStore((state) => Object.keys(state.carts));
export const useCartItemWithProduct = (id: string) =>
  useStore((state) => state.getCartWithProduct(id));
export const useCartSelection = () =>
  useStore((state) => state.getSelectedCartItems().length > 0);
export const useCartTotalPrice = () =>
  useStore((state) => state.getCartTotalPrice());
export const useCartAllSelected = () =>
  useStore((state) => state.isAllCartsSelected());
export const useAddToCart = () => useStore((state) => state.addToCart);
export const useIncrementCartQuantity = () =>
  useStore((state) => state.incrementCartQuantity);
export const useRemoveFromCart = () =>
  useStore((state) => state.removeFromCart);
export const useRemoveSelectedCarts = () =>
  useStore((state) => state.removeSelectedCarts);
export const useToggleCartSelect = () =>
  useStore((state) => state.toggleCartSelect);
export const useToggleAllCartsSelected = () =>
  useStore((state) => state.toggleAllCartsSelected);
export const useClearCart = () => useStore((state) => state.clearCart);

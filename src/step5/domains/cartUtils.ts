import type { Carts } from './types.ts';

export const cartUtils = {
  add(carts: Carts, productId: string) {
    const newCart = carts[productId] ?? {
      productId,
      quantity: 0,
      selected: false,
    };

    return {
      ...carts,
      [newCart.productId]: { ...newCart, quantity: newCart.quantity + 1 },
    };
  },
  updateQuantity: (carts: Carts, productId: string, quantity: number) => ({
    ...carts,
    [productId]: {
      ...carts[productId],
      quantity: Math.max(quantity, 1),
    },
  }),
  remove: (carts: Carts, productId: string) => {
    const newCarts = { ...carts };
    delete newCarts[productId];
    return newCarts;
  },
  removeSelected: (carts: Carts) =>
    Object.fromEntries(
      Object.entries(carts).filter(([, cart]) => !cart.selected)
    ),
  toggleSelect(carts: Carts, productId: string) {
    const { [productId]: cart } = carts;
    return {
      ...carts,
      [productId]: { ...cart, selected: !cart.selected },
    };
  },
  updateAllSelected: (carts: Carts, selected: boolean) =>
    Object.fromEntries(
      Object.entries(carts).map(([id, cart]) => [id, { ...cart, selected }])
    ),
  selectAll: (carts: Carts) => cartUtils.updateAllSelected(carts, true),
  deselectAll: (carts: Carts) => cartUtils.updateAllSelected(carts, false),
};

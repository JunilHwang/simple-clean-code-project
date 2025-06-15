import type { Carts, CartWithProduct, Products } from './types.ts';
import { productUtils } from './productUtils.ts';
import { cartUtils } from './cartUtils.ts';

export const cartService = {
  getTotalCartPrice: (carts: Carts, products: Products) =>
    Object.values(carts).reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0),
  getCartsWithProduct: (carts: Carts, products: Products): CartWithProduct[] =>
    Object.values(carts).map(({ productId, quantity, selected }) => {
      const product = products[productId];
      return {
        ...product,
        quantity,
        selected,
        subtotal: product.price * quantity,
      };
    }),
  addToCart: (carts: Carts, products: Products, id: string) => {
    const cartQuantity = carts[id]?.quantity ?? 0;
    const productQuantity = products[id].quantity;
    if (
      productUtils.isOutOfStock(products[id]) ||
      cartQuantity >= productQuantity
    ) {
      return carts;
    }
    return cartUtils.add(carts, id);
  },
  incrementCartQuantity: (
    carts: Carts,
    products: Products,
    id: string,
    quantity: number
  ) => {
    const cartQuantity = carts[id].quantity;
    const productQuantity = products[id].quantity;
    return cartUtils.updateQuantity(
      carts,
      id,
      Math.min(cartQuantity + quantity, productQuantity)
    );
  },
};

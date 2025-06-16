import { useState } from 'react';
import type { Carts, Product, Products } from '../domains/types.ts';
import { cartUtils } from '../domains/cartUtils.ts';
import { cartService } from '../domains/cartService.ts';

type ProductId = Product['id'];

export const useCarts = (products: Products) => {
  const [carts, setCarts] = useState<Carts>({});

  const totalPrice = cartService.getTotalCartPrice(carts, products);
  const itemsWithProduct = cartService.getCartsWithProduct(carts, products);
  const selectedItems = Object.values(itemsWithProduct).filter(
    (v) => v.selected
  );
  const selectedSize = selectedItems.length;

  const allSelected =
    selectedSize > 0 && selectedSize === itemsWithProduct.length;

  const add = (id: ProductId) =>
    setCarts((value) => cartService.addToCart(value, products, id));

  const incrementQuantity = (id: ProductId, quantity: number) =>
    setCarts((value) =>
      cartService.incrementCartQuantity(value, products, id, quantity)
    );

  const remove = (id: ProductId) =>
    setCarts((value) => cartUtils.remove(value, id));

  const removeSelected = () =>
    setCarts((value) => cartUtils.removeSelected(value));

  const toggleSelect = (id: ProductId) =>
    setCarts((value) => cartUtils.toggleSelect(value, id));

  const toggleAllSelected = () =>
    setCarts((value) => cartUtils.updateAllSelected(value, !allSelected));

  const clear = () => setCarts({});

  return {
    items: carts,
    itemsWithProduct,
    selectedItems,
    totalPrice,
    allSelected,
    add,
    incrementQuantity,
    remove,
    removeSelected,
    toggleSelect,
    toggleAllSelected,
    clear,
  };
};

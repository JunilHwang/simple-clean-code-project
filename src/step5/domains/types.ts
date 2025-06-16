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

export type Carts = Record<Product['id'], Cart>;
export type Products = Record<Product['id'], Product>;

export type CartWithProduct = Omit<Product, 'quantity'> &
  Pick<Cart, 'quantity' | 'selected'> & { subtotal: number };

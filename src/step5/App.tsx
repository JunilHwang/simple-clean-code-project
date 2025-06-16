import {
  CartItemList,
  CartSummary,
  ProductControls,
  ProductList,
} from './components.tsx';

export function App() {
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-8 text-center">쇼핑몰</h1>

      <div className="flex gap-8">
        <div className="flex-1">
          <ProductControls />
          <ProductList />
        </div>
        <div className="bg-white p-6 rounded-lg shadow w-[400px]">
          <h2 className="text-2xl font-bold mb-4">장바구니</h2>
          <CartItemList />
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

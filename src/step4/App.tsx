import { createStore } from './domains.ts';
import { AppContent } from './components.tsx';

export function App() {
  const store = createStore({});

  return (
    <AppContent
      products={store.products.items}
      carts={{
        items: store.cartsWithProduct,
        selectedIds: store.carts.selectedItems.map((v) => v.productId),
      }}
      totalCartPrice={store.totalCartPrice}
    />
  );
}

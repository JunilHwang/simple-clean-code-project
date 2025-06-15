import {
  CartItem,
  CartSummary,
  ProductControls,
  ProductItem,
} from './components.tsx';
import { useProducts } from './hooks/useProducts.ts';
import { useCarts } from './hooks/useCarts.ts';

export function App() {
  const products = useProducts();
  const carts = useCarts(products.items);
  const selection = carts.selectedItems.length > 0;

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-8 text-center">쇼핑몰</h1>

      <div className="flex gap-8">
        <div className="flex-1">
          <ProductControls
            onInputEnterKeyDown={(searchKey) =>
              products.changeOptions({ searchKey })
            }
            onOrderChange={(orderBy) => products.changeOptions({ orderBy })}
            onSortChange={(sortBy) => products.changeOptions({ sortBy })}
          />
          <div
            id="product-list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {products.filteredItems.map((product) => (
              <ProductItem
                key={product.id}
                {...product}
                onCartAddClick={carts.add}
              />
            ))}
          </div>
        </div>

        {/* 장바구니 */}
        <div className="bg-white p-6 rounded-lg shadow w-[400px]">
          <h2 className="text-2xl font-bold mb-4">장바구니</h2>
          <div id="cart-items">
            {carts.itemsWithProduct.length > 0 && (
              <div className="flex gap-2 mb-2 ml-3">
                <input
                  type="checkbox"
                  id="select-all-cart"
                  checked={carts.allSelected}
                  onChange={carts.toggleAllSelected}
                  readOnly
                />
              </div>
            )}
            {carts.itemsWithProduct.map((cartItem) => (
              <CartItem
                key={cartItem.id}
                {...cartItem}
                onIncrementClick={(id) => carts.updateQuantity(id, 1)}
                onDecrementClick={(id) => carts.updateQuantity(id, -1)}
                onRemoveClick={carts.remove}
                onSelect={carts.toggleSelect}
              />
            ))}
          </div>
          <CartSummary
            totalPrice={carts.totalPrice}
            selection={selection}
            onRemoveSelectedClick={carts.removeSelected}
            onClearCartClick={carts.clear}
          />
        </div>
      </div>
    </div>
  );
}

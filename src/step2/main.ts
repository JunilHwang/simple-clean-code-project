import { addEvent, setupEvents } from './apps';
import { App } from './components';
import { createStore } from './domains';

const store = createStore({});

function render() {
  const $root = document.getElementById('root');
  if ($root) {
    $root.innerHTML = App({
      products: store.products.items,
      carts: store.cartsWithProduct,
      totalCartPrice: store.totalCartPrice,
    });
  }

  setupEvents(() => {
    // 1. 상품목록에서 “장바구니 담기” 버튼을 클릭할 때
    addEvent('click', '.add-to-cart-btn', (event) => {
      const target = event.target as HTMLElement;
      const productId = target.getAttribute('data-product-id');
      if (productId) {
        store.carts.add(productId);
        render();
      }
    });

    // 2. 장바구니에서 +, - 버튼을 클릭할 때
    addEvent('click', '.increase-btn, .decrease-btn', (event) => {
      const target = event.target as HTMLElement;
      const cartItemEl = target.closest('.cart-item');
      const productId = cartItemEl?.getAttribute('data-product-id');
      if (!productId || !cartItemEl) {
        return;
      }

      const quantity = store.carts.value[productId]?.quantity || 0;
      const nextQuantity =
        quantity + (target.classList.contains('increase-btn') ? 1 : -1);

      store.carts.update(productId, nextQuantity);
      render();
    });

    // 3. 장바구니에서 ‘삭제” 버튼을 클리할 때
    addEvent('click', '.remove-btn', (event) => {
      const target = event.target as HTMLElement;
      const cartItemEl = target.closest('.cart-item');
      if (cartItemEl) {
        const productId = cartItemEl.getAttribute('data-product-id');
        if (productId) {
          store.carts.remove(productId);
          render();
        }
      }
    });

    // 4. 장바구니에서 “장바구니 비우기” 버튼을 클릭할 때
    addEvent('click', '#clear-cart', () => {
      store.carts.clear();
      render();
    });
  });
}

render();

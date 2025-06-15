import { addEvent, setupEvents } from './apps';
import { App } from './components';
import { createStore } from './domains';

const store = createStore({});

function render() {
  const $root = document.getElementById('root');
  if (!$root) {
    return;
  }

  $root.innerHTML = App({
    products: store.products.filteredItems,
    carts: {
      items: store.cartsWithProduct,
      selectedIds: store.carts.selectedItems.map((v) => v.productId),
    },
    totalCartPrice: store.totalCartPrice,
  });

  setupEvents(() => {
    // 1. 상품목록에서 “장바구니 담기” 버튼을 클릭할 때
    addEvent('click', '.add-to-cart-btn', (event) => {
      const target = event.target as HTMLElement;
      const productId = target.getAttribute('data-product-id');
      if (productId) {
        store.addToCart(productId);
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

      const quantity = target.classList.contains('increase-btn') ? 1 : -1;

      store.incrementCartQuantity(productId, quantity);
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

    // 5. 상품 검색
    addEvent('keydown', '#search-input', (event) => {
      if (event.key !== 'Enter') {
        return;
      }
      const target = event.target as HTMLInputElement;
      store.products.search(target.value);
      render();
    });

    // 6. 상품 정렬
    addEvent('change', '#sort-select, #order-select', () => {
      const sortSelect = document.getElementById(
        'sort-select'
      ) as HTMLSelectElement;
      const orderSelect = document.getElementById(
        'order-select'
      ) as HTMLSelectElement;

      if (sortSelect && orderSelect) {
        store.products.sort({
          sortBy: sortSelect.value as 'name' | 'price' | 'default',
          orderBy: orderSelect.value as 'asc' | 'desc',
        });
        render();
      }
    });

    // 7. 상품 다중 선택 - 전체 선택
    addEvent('click', '#select-all-products', () => {
      const checkboxes = document.querySelectorAll(
        '.product-checkbox:not(:disabled)'
      ) as NodeListOf<HTMLInputElement>;
      checkboxes.forEach((checkbox) => (checkbox.checked = true));
    });

    // 8. 상품 다중 선택 - 선택 해제
    addEvent('click', '#deselect-all-products', () => {
      const checkboxes = document.querySelectorAll(
        '.product-checkbox'
      ) as NodeListOf<HTMLInputElement>;
      checkboxes.forEach((checkbox) => (checkbox.checked = false));
    });

    // 9. 선택한 상품들 장바구니에 담기
    addEvent('click', '#add-selected-to-cart', () => {
      const checkedBoxes = document.querySelectorAll(
        '.product-checkbox:checked'
      ) as NodeListOf<HTMLInputElement>;
      const selectedProductIds: string[] = [];

      checkedBoxes.forEach((checkbox) => {
        const productId = checkbox.getAttribute('data-product-id');
        if (productId) {
          selectedProductIds.push(productId);
        }
      });

      selectedProductIds.forEach((productId) => {
        store.addToCart(productId);
      });

      // 선택 해제
      checkedBoxes.forEach((checkbox) => (checkbox.checked = false));
      render();
    });

    // 10. 장바구니 아이템 개별 선택
    addEvent('change', '.cart-item-checkbox', (event) => {
      const target = event.target as HTMLInputElement;
      const productId = target.getAttribute('data-product-id');
      if (productId) {
        store.carts.toggleSelect(productId);
        render();
      }
    });

    // 11. 장바구니 전체 선택
    addEvent('click', '#select-all-cart', () => {
      const { selectedItems, items } = store.carts;
      if (selectedItems.length === items.length) {
        store.carts.deselectAll();
      } else {
        store.carts.selectAll();
      }
      render();
    });

    // 12. 장바구니 선택 해제
    addEvent('click', '#deselect-all-cart', () => {
      store.carts.deselectAll();
      render();
    });

    // 13. 선택한 장바구니 아이템 삭제
    addEvent('click', '#remove-selected-cart', () => {
      store.carts.removeSelected();
      render();
    });
  });
}

render();

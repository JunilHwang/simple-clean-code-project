// 총 가격 업데이트 함수
function updateTotalPrice() {
  let total = 0;
  const cartItems = document.getElementById('cart-items');
  const cartItemElements = cartItems?.querySelectorAll('.cart-item');

  if (cartItemElements) {
    for (const element of cartItemElements) {
      const subtotalText = element.querySelector('.subtotal')?.textContent;
      const subtotal = parseInt(subtotalText?.replace(/\D/g, '') ?? '0');
      total += subtotal;
    }
  }

  const totalPriceEl = document.getElementById('total-price');
  if (totalPriceEl) {
    totalPriceEl.textContent = total.toLocaleString() + '원';
  }
}

function main() {
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

  for (const element of addToCartBtns) {
    element.addEventListener('click', function (e) {
      const target = e.target as HTMLButtonElement;
      const productId = target.getAttribute('data-product-id');
      const productEl = target.closest('.bg-white');
      const productName = productEl?.querySelector('h3')?.textContent;
      const productPriceText = productEl?.querySelector('p')?.textContent;
      const productPrice = parseInt(
        productPriceText?.replace(/\D/g, '') ?? '0'
      );
      const productImg = productEl?.querySelector('img')?.getAttribute('src');

      // 장바구니에서 같은 상품 찾기
      const cartItems = document.getElementById('cart-items');
      let existingItem = null;
      const cartItemElements = cartItems?.querySelectorAll('.cart-item');
      if (cartItemElements) {
        for (const element of cartItemElements) {
          const itemEl = element;
          if (itemEl.getAttribute('data-product-id') === productId) {
            existingItem = itemEl;
            break;
          }
        }
      }

      if (existingItem) {
        // 기존 아이템 수량 증가
        const quantityEl = existingItem.querySelector(
          '.quantity'
        ) as HTMLSpanElement;
        let currentQuantity = parseInt(quantityEl.textContent ?? '0');
        currentQuantity++;
        quantityEl.textContent = currentQuantity.toString();

        // 소계 업데이트
        const subtotalEl = existingItem.querySelector(
          '.subtotal'
        ) as HTMLSpanElement;
        const newSubtotal = currentQuantity * productPrice;
        console.log('newSubtotal', newSubtotal);
        subtotalEl.textContent = newSubtotal.toLocaleString() + '원';
      } else {
        // 새 아이템 추가
        const cartItemHTML = `
      <div class="cart-item flex items-center gap-3 p-3 border-t" data-product-id="${productId}">
        <img src="${productImg}" alt="${productName}" class="w-16 h-16 object-cover rounded">
        <div class="flex-1">
          <h4 class="font-bold text-sm">${productName}</h4>
          <p class="text-gray-600 text-sm">${productPrice.toLocaleString()}원</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="decrease-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">-</button>
            <span class="quantity">1</span>
            <button class="increase-btn bg-gray-300 text-gray-700 w-6 h-6 rounded text-sm">+</button>
            <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">삭제</button>
          </div>
        </div>
        <div class="text-right">
          <span class="subtotal font-bold">${productPrice.toLocaleString()}원</span>
        </div>
      </div>
    `;
        cartItems?.insertAdjacentHTML('beforeend', cartItemHTML);
      }

      updateTotalPrice();
    });
  }

  // 장바구니 비우기 버튼
  document.getElementById('clear-cart')?.addEventListener('click', () => {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
      cartItems.innerHTML = '';
    }
    updateTotalPrice();
  });

  // 장바구니 아이템 이벤트 위임
  document.getElementById('cart-items')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const cartItem = target.closest('.cart-item');

    if (target.classList.contains('increase-btn')) {
      const quantityEl = cartItem?.querySelector(
        '.quantity'
      ) as HTMLSpanElement;
      let currentQuantity = parseInt(quantityEl.textContent ?? '0');
      currentQuantity++;
      quantityEl.textContent = currentQuantity.toString();

      // 가격 정보 가져오기
      const priceText = cartItem?.querySelector('p')?.textContent;
      const price = parseInt(priceText?.replace(/\D/g, '') ?? '0');

      // 소계 업데이트
      const subtotalEl = cartItem?.querySelector(
        '.subtotal'
      ) as HTMLSpanElement;
      const newSubtotal = currentQuantity * price;
      subtotalEl.textContent = newSubtotal.toLocaleString() + '원';

      updateTotalPrice();
    }

    if (target.classList.contains('decrease-btn')) {
      const quantityEl = cartItem?.querySelector(
        '.quantity'
      ) as HTMLSpanElement;
      let currentQuantity = parseInt(quantityEl.textContent ?? '0');
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityEl.textContent = currentQuantity.toString();

        // 가격 정보 가져오기
        const priceText = cartItem?.querySelector('p')?.textContent;
        const price = parseInt(priceText?.replace(/\D/g, '') ?? '0');

        // 소계 업데이트
        const subtotalEl = cartItem?.querySelector(
          '.subtotal'
        ) as HTMLSpanElement;
        const newSubtotal = currentQuantity * price;
        subtotalEl.textContent = newSubtotal.toLocaleString() + '원';

        updateTotalPrice();
      }
    }

    if (target.classList.contains('remove-btn')) {
      cartItem?.remove();
      updateTotalPrice();
    }
  });
}

main();

import { test, expect, type Page } from '@playwright/test';

async function testFirstAssignmentAtPage(page: Page, path: string) {
  await page.goto(`http://localhost:5173/${path}.html`);
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - img /맥북 프로 \\d+인치/
    - heading /맥북 프로 \\d+인치/ [level=3]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "장바구니 담기"
    - img /아이폰 \\d+ Pro/
    - heading /아이폰 \\d+ Pro/ [level=3]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "장바구니 담기"
    - img "갤럭시 S24"
    - heading "갤럭시 S24" [level=3]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "장바구니 담기"
    - img "에어팟 프로"
    - heading "에어팟 프로" [level=3]
    - paragraph: /\\d+,\\d+원/
    - button "장바구니 담기"
    - img "맥북 에어"
    - heading "맥북 에어" [level=3]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "장바구니 담기"
    - img "아이패드 프로"
    - heading "아이패드 프로" [level=3]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "장바구니 담기"
    - img "삼성 모니터"
    - heading "삼성 모니터" [level=3]
    - paragraph: /\\d+,\\d+원/
    - button "장바구니 담기"
    - img "무선 키보드"
    - heading "무선 키보드" [level=3]
    - paragraph: /\\d+,\\d+원/
    - button "장바구니 담기"
    - img "무선 마우스"
    - heading "무선 마우스" [level=3]
    - paragraph: /\\d+,\\d+원/
    - button "장바구니 담기"
    - img "스피커"
    - heading "스피커" [level=3]
    - paragraph: /\\d+,\\d+원/
    - button "장바구니 담기"
    - heading "장바구니" [level=2]
    - text: "총 합계: 0원"
    - button "장바구니 비우기"
    `);
  await page.locator('#product-list div').filter({ hasText: '맥북 프로 14인치 2,990,000원 장바구니 담기' }).getByRole('button').click();
  await page.locator('#product-list div').filter({ hasText: '아이폰 15 Pro 1,550,000원 장바구니 담기' }).getByRole('button').click();
  await page.locator('#product-list div').filter({ hasText: '갤럭시 S24 1,200,000원 장바구니 담기' }).getByRole('button').click();
  await page.locator('#product-list div').filter({ hasText: '에어팟 프로 350,000원 장바구니 담기' }).getByRole('button').click();
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByRole('button', { name: '+' }).nth(1).click();
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await page.getByRole('button', { name: '+' }).nth(2).click();
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - heading "장바구니" [level=2]
    - img /맥북 프로 \\d+인치/
    - heading /맥북 프로 \\d+인치/ [level=4]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "-"
    - text: "2"
    - button "+"
    - button "삭제"
    - text: /\\d+,\\d+,\\d+원/
    - img /아이폰 \\d+ Pro/
    - heading /아이폰 \\d+ Pro/ [level=4]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "-"
    - text: "3"
    - button "+"
    - button "삭제"
    - text: /\\d+,\\d+,\\d+원/
    - img "갤럭시 S24"
    - heading "갤럭시 S24" [level=4]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "-"
    - text: "3"
    - button "+"
    - button "삭제"
    - text: /\\d+,\\d+,\\d+원/
    - img "에어팟 프로"
    - heading "에어팟 프로" [level=4]
    - paragraph: /\\d+,\\d+원/
    - button "-"
    - text: "1"
    - button "+"
    - button "삭제"
    - text: "/\\\\d+,\\\\d+원 총 합계: \\\\d+,\\\\d+,\\\\d+원/"
    - button "장바구니 비우기"
    `);
  await page.getByRole('button', { name: '-' }).nth(2).click();
  await page.getByRole('button', { name: '삭제' }).nth(1).click();
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - heading "장바구니" [level=2]
    - img /맥북 프로 \\d+인치/
    - heading /맥북 프로 \\d+인치/ [level=4]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "-"
    - text: "2"
    - button "+"
    - button "삭제"
    - text: /\\d+,\\d+,\\d+원/
    - img "갤럭시 S24"
    - heading "갤럭시 S24" [level=4]
    - paragraph: /\\d+,\\d+,\\d+원/
    - button "-"
    - text: "2"
    - button "+"
    - button "삭제"
    - text: /\\d+,\\d+,\\d+원/
    - img "에어팟 프로"
    - heading "에어팟 프로" [level=4]
    - paragraph: /\\d+,\\d+원/
    - button "-"
    - text: "1"
    - button "+"
    - button "삭제"
    - text: "/\\\\d+,\\\\d+원 총 합계: \\\\d+,\\\\d+,\\\\d+원/"
    - button "장바구니 비우기"
    `);
  await page.getByRole('button', { name: '장바구니 비우기' }).click();
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - heading "장바구니" [level=2]
    - text: "총 합계: 0원"
    - button "장바구니 비우기"
    `);
}

test.describe('첫 번째 요구사항에 대한 테스트 > ', () => {
  test('step1 > ', async ({ page }) => {
    await testFirstAssignmentAtPage(page, 'step1');
  });
  test('step2 > ', async ({ page }) => {
    await testFirstAssignmentAtPage(page, 'step2');
  });
})

test('두 번째 요구사항에 대한 테스트 > ', async ({ page }) => {
  await page.goto(`http://localhost:5173/step3.html`);

  // 기본 화면 요소 확인
  await expect(page.locator('h1')).toHaveText('쇼핑몰');
  await expect(page.locator('h2')).toHaveText('장바구니');

  // 상품 컨트롤 요소 확인
  await expect(page.locator('#search-input')).toBeVisible();
  await expect(page.locator('#sort-select')).toBeVisible();
  await expect(page.locator('#order-select')).toBeVisible();

  // 초기 상태에서 총 합계가 0원인지 확인
  await expect(page.locator('#total-price')).toHaveText('0원');

  // 1. 상품 검색 기능 테스트
  await page.fill('#search-input', '맥북');
  await page.press('#search-input', 'Enter');
  // 맥북 관련 상품만 보여야 함
  await expect(page.locator('.product-item')).toHaveCount(2); // 맥북 프로, 맥북 에어

  // 검색 초기화
  await page.fill('#search-input', '');
  await page.press('#search-input', 'Enter');

  // 2. 상품 정렬 기능 테스트
  await page.selectOption('#sort-select', 'price');
  await page.selectOption('#order-select', 'asc');
  // 가격 오름차순으로 정렬되는지 확인은 상품 순서로 판단

  // 3. 장바구니에 상품 추가
  await page.click('.product-item[data-product-id="1"] .add-to-cart-btn');
  await page.click('.product-item[data-product-id="2"] .add-to-cart-btn');
  await page.click('.product-item[data-product-id="4"] .add-to-cart-btn');

  // 장바구니에 아이템이 추가되었는지 확인
  await expect(page.locator('.cart-item')).toHaveCount(3);
  await expect(page.locator('#select-all-cart')).toBeVisible(); // 전체 선택 체크박스가 나타남

  // 4. 장바구니 수량 변경 테스트
  await page.click('.cart-item[data-product-id="1"] .increase-btn');
  await page.click('.cart-item[data-product-id="1"] .increase-btn');
  // 첫 번째 상품의 수량이 3이 되었는지 확인
  await expect(page.locator('.cart-item[data-product-id="1"] .quantity')).toHaveText('3');

  // 수량 감소 테스트
  await page.click('.cart-item[data-product-id="1"] .decrease-btn');
  await expect(page.locator('.cart-item[data-product-id="1"] .quantity')).toHaveText('2');

  // 5. 장바구니 개별 선택 테스트
  await page.check('.cart-item[data-product-id="1"] .cart-item-checkbox');
  await page.check('.cart-item[data-product-id="2"] .cart-item-checkbox');

  // 선택 삭제 버튼이 활성화되었는지 확인
  await expect(page.locator('#remove-selected-cart')).not.toHaveAttribute('disabled');

  // 6. 전체 선택 기능 테스트
  await page.click('#select-all-cart');
  // 모든 아이템이 선택되었는지 확인
  await expect(page.locator('.cart-item-checkbox:checked')).toHaveCount(3);

  // 전체 선택 해제
  await page.click('#select-all-cart');
  await expect(page.locator('.cart-item-checkbox:checked')).toHaveCount(0);

  // 7. 선택한 아이템 삭제 테스트
  await page.check('.cart-item[data-product-id="1"] .cart-item-checkbox');
  await page.check('.cart-item[data-product-id="2"] .cart-item-checkbox');
  await page.click('#remove-selected-cart');

  // 선택한 아이템들이 삭제되고 1개만 남았는지 확인
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await expect(page.locator('.cart-item[data-product-id="4"]')).toBeVisible();

  // 8. 개별 상품 삭제 테스트
  await page.click('.cart-item[data-product-id="4"] .remove-btn');
  await expect(page.locator('.cart-item')).toHaveCount(0);
  await expect(page.locator('#total-price')).toHaveText('0원');

  // 9. 재고 관리 테스트 - 재고가 있는 상품에 최대 재고까지 추가
  const productWithStock = page.locator('.product-item').first();
  const stockText = await productWithStock.locator('p').last().textContent();
  const stockMatch = stockText?.match(/재고: (\d+)개/);
  const stockCount = stockMatch ? parseInt(stockMatch[1]) : 0;

  if (stockCount > 0) {
    // 첫 번째 상품을 장바구니에 추가
    await productWithStock.locator('.add-to-cart-btn').click();

    // 재고만큼 수량 증가 시도
    for (let i = 1; i < stockCount; i++) {
      await page.click('.cart-item .increase-btn');
    }

    // 재고 이상으로 추가 시도해도 재고 수량을 넘지 않는지 확인
    await page.click('.cart-item .increase-btn');
    await page.click('.cart-item .increase-btn');
    await expect(page.locator('.cart-item .quantity')).toHaveText(stockCount.toString());
  }

  // 10. 전체 비우기 테스트
  await page.click('#clear-cart');
  await expect(page.locator('.cart-item')).toHaveCount(0);
  await expect(page.locator('#total-price')).toHaveText('0원');

  // 품절 테스트 (재고가 0인 상품)
  const soldOutProduct = page.locator('.product-item[data-product-id="3"]');

  // 품절 상품의 버튼이 비활성화되어 있는지 확인
  await expect(soldOutProduct.locator('.add-to-cart-btn')).toHaveAttribute('disabled');
  await expect(soldOutProduct.locator('.add-to-cart-btn')).toHaveText('품절');
  await expect(soldOutProduct.locator('img')).toHaveClass(/opacity-50/);
});

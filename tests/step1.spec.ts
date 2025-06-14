import { test, expect } from '@playwright/test';

test('쇼핑몰 장바구니 테스트', async ({ page }) => {
  await page.goto('http://localhost:5173/');
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
});

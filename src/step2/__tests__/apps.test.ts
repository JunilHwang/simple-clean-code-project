import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { addEvent, setupEvents } from '../apps';

describe('Apps > ', () => {
  describe('addEvent', () => {
    // 테스트 전 DOM 요소 설정
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="container">
          <button id="test-button">테스트 버튼</button>
          <div class="item">아이템 1</div>
          <div class="item">아이템 2</div>
        </div>
      `;
    });

    // 테스트 후 DOM 요소 초기화
    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('선택자에 맞는 요소 클릭 시 콜백 함수가 호출된다', () => {
      const mockCallback = vi.fn();
      const button = document.getElementById('test-button');

      addEvent('click', '#test-button', mockCallback);

      // 클릭 이벤트 시뮬레이션
      button?.click();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('부모 요소를 지정하여 이벤트를 등록할 수 있다', () => {
      const container = document.getElementById('container') as HTMLElement;
      const mockCallback = vi.fn();

      if (container) {
        addEvent('click', '.item', mockCallback, container);

        // 첫 번째 아이템 클릭 시뮬레이션
        const firstItem = document.querySelector('.item');
        firstItem?.dispatchEvent(new Event('click', { bubbles: true }));

        expect(mockCallback).toHaveBeenCalledTimes(1);
      }
    });

    test('선택자와 일치하지 않는 요소 클릭 시 콜백 함수가 호출되지 않는다', () => {
      const mockCallback = vi.fn();

      addEvent('click', '.non-existent', mockCallback);

      // 버튼을 클릭해도 콜백이 호출되지 않음
      const button = document.getElementById('test-button');
      button?.click();

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  test('setup 함수는 처음 호출될 때만 실행된다.', () => {
    const setupFn = vi.fn();

    // 첫 번째 호출
    setupEvents(setupFn);
    expect(setupFn).toHaveBeenCalledTimes(1);

    // 두 번째 호출
    setupEvents(setupFn);
    expect(setupFn).toHaveBeenCalledTimes(1); // 여전히 1회만 호출됨

    // 세 번째 호출
    setupEvents(setupFn);
    expect(setupFn).toHaveBeenCalledTimes(1); // 여전히 1회만 호출됨
  });
});

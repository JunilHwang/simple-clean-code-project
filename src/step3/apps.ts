export function addEvent<K extends keyof HTMLElementEventMap>(
  eventType: K,
  selector: string,
  callback: (event: HTMLElementEventMap[K]) => void,
  parent: HTMLElement = document.body
) {
  parent.addEventListener(eventType, (event) => {
    const target = event.target as HTMLElement;
    if (target.closest(selector)) {
      callback(event);
    }
  });
}

export const setupEvents = (() => {
  let initialized = false;
  return (setup: () => void) => {
    if (!initialized) {
      setup();
      initialized = true;
    }
  };
})();

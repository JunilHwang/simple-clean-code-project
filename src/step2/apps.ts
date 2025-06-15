export function addEvent(
  eventType: string,
  selector: string,
  callback: (event: Event) => void,
  parent = document
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

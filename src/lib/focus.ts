// After a client-side navigation, move focus to the new page's <h1> so screen-reader and keyboard users
// land at the start of the content (the initial load keeps the browser's default focus).

let navigated = false;

export const markNavigated = () => { navigated = true; };

export function focusPageTitle(el: HTMLElement | null) {
  if (!navigated || !el) return;
  el.focus({ preventScroll: true });
}

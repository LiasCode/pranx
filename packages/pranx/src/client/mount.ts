import { type ComponentChild, hydrate } from "preact";

export function mount(app: ComponentChild, root: Element | DocumentFragment): void {
  document.addEventListener("DOMContentLoaded", () => {
    hydrate(app, root);
  });
}

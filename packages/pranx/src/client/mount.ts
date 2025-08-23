import { hydrate, type VNode } from "preact";

export function mount(app: VNode<any>, root: Element | DocumentFragment): void {
  document.addEventListener("DOMContentLoaded", () => {
    hydrate(app, root);
  });
}

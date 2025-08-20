import { hydrate, type VNode } from "preact";

export type HYDRATE_DATA = {
  routes: {
    path: string;
    module: string;
    props: Record<string, any>;
    type: "ssr" | "ssg" | "isg";
  }[];
};

declare global {
  interface Window {
    __PRANX_HYDRATE_DATA__: HYDRATE_DATA;
  }
}

export function mount(app: VNode<any>, root: Element | DocumentFragment): void {
  document.addEventListener("DOMContentLoaded", () => {
    const hydrate_raw_string = document.getElementById("__PRANX_HYDRATE_DATA__")?.textContent;
    if (!hydrate_raw_string) {
      console.error(
        "No hydration data found. Ensure the server rendered the __PRANX_HYDRATE_DATA__ element."
      );
      return;
    }
    window.__PRANX_HYDRATE_DATA__ = JSON.parse(hydrate_raw_string) as HYDRATE_DATA;
    hydrate(app, root);
  });
}

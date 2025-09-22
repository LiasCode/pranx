import type { ComponentChildren, VNode } from "preact";
import type { PranxRouterProps } from "types/client";
import { AppContextProvider } from "./app-context";
import { RouterMPA } from "./routing/router-mpa";
import { RouterSPA } from "./routing/router-spa";

export function PranxRouter(props: PranxRouterProps): VNode<any> | ComponentChildren {
  const { mode = "spa", children } = props;

  if (typeof window === "undefined") return children;

  window.pranx = {
    router_mode: mode,
  };

  if (mode === "mpa") {
    return <RouterMPA />;
  }

  if (mode === "spa") {
    return (
      <AppContextProvider>
        <RouterSPA />
      </AppContextProvider>
    );
  }

  throw new Error("The mode should be 'spa' or 'mpa'");
}

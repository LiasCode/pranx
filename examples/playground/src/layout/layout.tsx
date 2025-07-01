import type { PropsWithChildren } from "preact/compat";
import "./layout.scss";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div id="app">
      <div id="layout">{props.children}</div>
    </div>
  );
};

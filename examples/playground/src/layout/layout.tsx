import type { PropsWithChildren } from "preact/compat";
import { Header } from "../components/Header";
import "./layout.scss";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div id="app">
      <div id="layout">
        <Header />
        {props.children}
      </div>
    </div>
  );
};

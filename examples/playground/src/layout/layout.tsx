import type { PropsWithChildren } from "preact/compat";
import "./layout.scss";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div id="app">
      <div id="layout">
        <h2>Links With Client side navigation</h2>

        <ul id="links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/docs">Docs</a>
          </li>
        </ul>

        {props.children}
      </div>
    </div>
  );
};

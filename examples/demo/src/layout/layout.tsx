import { PropsWithChildren } from "preact/compat";
import "./layout.css";

export default function Layout(props: PropsWithChildren) {
  return (
    <div class="layout">
      <header>
        <h1>Prext</h1>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>

          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </header>

      {props.children}

      <footer></footer>
    </div>
  );
}

import { PropsWithChildren, useEffect } from "preact/compat";
import toast, { Toaster } from "react-hot-toast";
import "./layout.css";

export default function Layout(props: PropsWithChildren) {
  useEffect(() => {
    toast.success("Toast Working, It can use React Libraries to");
  }, []);

  return (
    <div id="pranx-root">
      <div class="layout">
        <Toaster position="bottom-right" />
        <header>
          <h1>Pranx</h1>
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

            <li>
              <a href="/json">JSON</a>
            </li>
          </ul>
        </header>

        <main>{props.children}</main>

        <footer>Pranx. All rights reserved. Made by @LiasCode</footer>
      </div>
    </div>
  );
}

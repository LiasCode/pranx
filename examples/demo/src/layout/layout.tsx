import { PropsWithChildren, useEffect } from "preact/compat";
import toast, { Toaster } from "react-hot-toast";
import "./layout.css";

export default function Layout(props: PropsWithChildren) {
  useEffect(() => {
    toast.success("Toast Working, It can use React Libraries to");
  }, []);

  return (
    <div id="prext-root">
      <div class="layout">
        <Toaster position="bottom-right" />
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

        <main>{props.children}</main>

        <footer>Prext. All rights reserved. Made by @LiasCode</footer>
      </div>
    </div>
  );
}

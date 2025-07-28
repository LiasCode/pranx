import type { PropsWithChildren } from "preact/compat";
import "./layout.css";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="w-full h-full flex flex-col items-center border border-purple-300 p-4 max-w-screen-md place-self-center">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <ul class="flex flex-row gap-3 border border-blue-400 rounded p-2">
          <li className="hover:text-purple-300">
            <a href="/">Home</a>
          </li>

          <li className="hover:text-purple-300">
            <a href="/about">About</a>
          </li>

          <li className="hover:text-purple-300">
            <a href="/docs">Docs</a>
          </li>

          <li className="hover:text-purple-300">
            <a href="/server_props">Server Props</a>
          </li>

          <li className="hover:text-purple-300">
            <a href={`/product/${Math.trunc(Math.random() * 10)}`}>Product Details</a>
          </li>
        </ul>

        {props.children}
      </div>
    </div>
  );
};

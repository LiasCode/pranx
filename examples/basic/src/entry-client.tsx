import { mount, StartApp } from "pranx/client";
import { App } from "./App";

mount(
  <App>
    <StartApp />
  </App>,
  document.body
);

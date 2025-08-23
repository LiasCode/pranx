import { mount, StartApp } from "pranx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
mount(<StartApp />, document.querySelector("#app")!);

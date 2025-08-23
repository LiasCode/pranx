import { mount, StartApp } from "pranx";
import "./styles/base.css";
import "./styles/styles.css";

// biome-ignore lint/style/noNonNullAssertion
mount(<StartApp />, document.querySelector("#app")!);

import type { PropsWithChildren } from "preact/compat";
import { UserProvider } from "./context/user-context";
import "./styles/styles.css";

export function App(props: PropsWithChildren) {
  return <UserProvider>{props.children}</UserProvider>;
}

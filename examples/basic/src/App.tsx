import { PranxRouter } from "pranx/client";
import type { PropsWithChildren } from "preact/compat";
import { UserProvider } from "./context/user-context";
import "./styles/styles.css";

export default function App(props: PropsWithChildren) {
  return (
    <UserProvider>
      <PranxRouter mode="spa" />
      {props.children}
    </UserProvider>
  );
}

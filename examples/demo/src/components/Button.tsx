import { PropsWithChildren } from "preact/compat";
import "./Button.css";

export function Button(props: PropsWithChildren) {
  return (
    <button
      onClick={() => {
        console.log("Button clicked!");
      }}
    >
      {props.children}
    </button>
  );
}

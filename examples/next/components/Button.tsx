import { PropsWithChildren } from "preact/compat";

export function Button(props: PropsWithChildren) {
  return (
    <button
      style={{
        backgroundColor: "blue",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => {
        console.log("Button clicked!");
      }}
    >
      {props.children}
    </button>
  );
}

import { type ComponentProps, forwardRef } from "preact/compat";
import { _useAppContext } from "../app-context.js";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  to: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
  if (!props.to) {
    throw new Error("Link element must provide a `to` property");
  }
  const { set } = _useAppContext();
  return (
    <a
      ref={forwardedRef}
      {...props}
      data-to={props.to}
      href={props.to}
      onClick={(e) => {
        e.preventDefault();
        set("prop_status", "loading");
      }}
    >
      {props.children}
    </a>
  );
});

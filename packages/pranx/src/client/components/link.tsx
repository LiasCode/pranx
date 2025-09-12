import { type ComponentProps, forwardRef } from "preact/compat";
import { _useAppContext } from "../app-context";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  to: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
  if (!props.to) {
    throw new Error("Link element must provide a `to` property");
  }

  if (typeof window !== "undefined" && window.pranx.csr_enabled === true) {
    const { set } = _useAppContext();
    return (
      <a
        ref={forwardedRef}
        {...props}
        data-to={props.to}
        href={props.to}
        onClick={() => {
          set("prop_status", "loading");
        }}
      >
        {props.children}
      </a>
    );
  }

  return (
    <a
      ref={forwardedRef}
      {...props}
      data-to={props.to}
      href={props.to}
    >
      {props.children}
    </a>
  );
});

import { type ComponentProps, forwardRef } from "preact/compat";
import type { LinkProps } from "types/client";
import { _useAppContext } from "../app-context";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
  if (!props.to) {
    throw new Error("Link element must provide a `to` property");
  }

  if (typeof window === "undefined" || window.pranx.router_mode === "mpa") {
    return (
      <LinkMpa
        ref={forwardedRef}
        {...props}
      />
    );
  }

  if (window.pranx.router_mode === "spa") {
    return (
      <LinkSPA
        ref={forwardedRef}
        {...props}
      />
    );
  }

  return <LinkFallback />;
});

export const LinkSPA = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
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
});

export const LinkMpa = forwardRef<HTMLAnchorElement, LinkProps>((props, forwardedRef) => {
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

export const LinkFallback = forwardRef<HTMLAnchorElement, ComponentProps<"a">>(
  (props, forwardedRef) => {
    return (
      <a
        ref={forwardedRef}
        {...props}
      />
    );
  }
);

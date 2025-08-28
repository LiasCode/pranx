import { useLocation } from "preact-iso";
import { type ComponentProps, forwardRef } from "preact/compat";
import { useAppContext } from "./AppContext.js";

export type LinkProps = ComponentProps<"span"> & {
  to: string;
};

export const Link = forwardRef<HTMLSpanElement, LinkProps>((props, forwardedRef) => {
  if (!props.to) {
    throw new Error("Link element must provide a `to` property");
  }
  const { route } = useLocation();
  const { onRouteWillChange } = useAppContext();

  const onClickHandler = async (event: MouseEvent) => {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) {
      return;
    }

    const goToNextRoute = await onRouteWillChange(props.to);

    if (goToNextRoute) {
      route(props.to);
    }
  };

  return (
    <span
      ref={forwardedRef}
      {...props}
      onClick={onClickHandler}
      data-to={props.to}
      role="link"
      tabIndex={0}
    >
      {props.children}
    </span>
  );
});

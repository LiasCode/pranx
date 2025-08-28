import { type VNode, cloneElement } from "preact";
import { type PropsWithChildren, Children } from "preact/compat";
import { _useAppContext } from "../app-context.js";

export const ServerPage = (props: PropsWithChildren) => {
  const child = Children.only(props.children) as VNode<any>;
  const { _props } = _useAppContext();

  return cloneElement(child, _props ?? {});
};

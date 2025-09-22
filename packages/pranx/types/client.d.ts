import { ComponentProps, FunctionalComponent, Ref, VNode } from "preact";
import { PropsWithChildren } from "preact/compat";

export type LinkProps = ComponentProps<"a"> & {
  to: string;
};

export declare const Link: FunctionalComponent<
  React.PropsWithoutRef<LinkProps> & {
    ref?: Ref<HTMLAnchorElement> | undefined;
  }
>;

export declare const useAppContext: () => {
  props: Record<string, any> | null;
  props_status: "ready" | "loading" | "error";
};

export function mount(app: any, root: Element | DocumentFragment): void;

export type PranxRouterProps = PropsWithChildren & {
  /**
   * @default "spa"
   */
  mode: "spa" | "mpa";
};

export function PranxRouter(props: PranxRouterProps): VNode<any> | ComponentChildren;

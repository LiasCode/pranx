import { ComponentProps, FunctionalComponent, Ref, VNode } from "preact";

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

export function StartApp(): VNode<any>;

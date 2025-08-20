import { VNode } from "preact";
import { PropsWithChildren } from "preact/compat";

// Pranx --------------------------------------------
export type GetStaticProps = () => void;

export function mount(app: any, root: Element | DocumentFragment): void;

export const StartApp: () => VNode<any>;
export const Scripts: () => VNode<any>;

export type LayoutProps = PropsWithChildren & { data: any };

export type LayoutModule = {
  default(): VNode<LayoutProps>;
};

export type PageModule = {
  default(): VNode<PropsWithChildren>;
};

import { ComponentChildren, VNode } from "preact";
import { PropsWithChildren } from "preact/compat";

// Pranx --------------------------------------------
export type GetStaticProps = () => void;

export function mount(app: any, root: Element | DocumentFragment): void;

export function StartApp(): VNode<any>;
export function Scripts(): VNode<any>;
export function Meta(): VNode<any>;

export type ServerEntryProps = PropsWithChildren;

export type ServerEntryModule = {
  default(): VNode<ServerEntryProps>;
};

export type PageModule = {
  default(): VNode<PropsWithChildren>;
};

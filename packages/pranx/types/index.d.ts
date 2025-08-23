import { VNode } from "preact";
import { PropsWithChildren } from "preact/compat";
import { useHead } from "unhead";

export function mount(app: any, root: Element | DocumentFragment): void;

export function StartApp(): VNode<any>;
export function Scripts(): VNode<any>;
export function Meta(): VNode<any>;

export type ServerEntryProps = PropsWithChildren;

export type ServerEntryModule = {
  default(): VNode<ServerEntryProps>;
};

// Page Module

// Static
interface GetStaticPathsResult<T extends Record<string, any> = Record<string, string>> {
  paths: Array<{ params: T }>;
  fallback: boolean | "blocking";
}

export type GetStaticPathsFunction = () => Promise<GetStaticPathsResult>;

interface GetStaticPropsResult<T> {
  props: T;
  revalidate?: number;
}

export type GetStaticPropsFunction<
  T extends Record<string, any> = {},
  P extends GetStaticPathsResult = GetStaticPathsResult,
> = (props: P) => Promise<GetStaticPropsResult<T>>;

// Server Side
export type GetServerSidePropsFunction<T extends unknown = unknown> = () => Promise<T>;

// Meta
export type MetaFunction = typeof useHead;

export type Page = VNode<any>;

export type PageModule = {
  default(): Page;
  getStaticProps?: GetStaticPropsFunction;
  getServerSideProps?: GetServerSidePropsFunction;
  getStaticPaths?: GetStaticPathsFunction;
  meta?: MetaFunction;
};

type InferProps<F> = F extends (...args: any[]) => infer R
  ? Awaited<R> extends { props: infer P }
    ? P
    : never
  : never;

export type RouteRenderingKind = "static" | "server-side";

// Manifest
export type SERVER_MANIFEST = {
  entry_server: string;
  routes: Array<{
    path: string;
    module: string;
    props: Record<string, any>;
    rendering_kind: RouteRenderingKind;
    revalidate: number;
    is_dynamic: boolean;
    dynamic_params: Array<string>;
  }>;
};

export type HYDRATE_DATA = {
  routes: {
    path: string;
    module: string;
    props: Record<string, any>;
    rendering_kind: RouteRenderingKind;
  }[];
};

declare global {
  interface Window {
    __PRANX_HYDRATE_DATA__: HYDRATE_DATA;
  }
}

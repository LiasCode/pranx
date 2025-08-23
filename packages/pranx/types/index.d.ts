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
interface GetStaticPathsResult<Params extends Record<string, any> = {}> {
  paths: Array<{ params: Params }>;
  fallback: boolean | "blocking";
}

export type GetStaticPathsFunction = () => Promise<GetStaticPathsResult>;

interface GetStaticPropsResult<Props> {
  props: Props;
  revalidate?: number;
}

export type GetStaticPropsFunction<
  Props extends Record<string, any> = {},
  Params extends GetStaticPathsResult = GetStaticPathsResult,
> = (props: Params) => Promise<GetStaticPropsResult<Props>>;

// Server Side
export type GetServerSidePropsFunction<Props extends Record<string, any> = {}> =
  () => Promise<Props>;

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
    css: string[];
  }>;
};

export type HYDRATE_DATA = {
  routes: {
    path: string;
    module: string;
    props: Record<string, any>;
    rendering_kind: RouteRenderingKind;
    css: string[];
  }[];
};

declare global {
  interface Window {
    __PRANX_HYDRATE_DATA__: HYDRATE_DATA;
  }
}

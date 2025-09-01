import { BuildOptions } from "esbuild";
import { EventHandlerRequest, H3Event } from "h3";
import { VNode } from "preact";
import { PropsWithChildren } from "preact/compat";
import { useHead } from "unhead";

export type ServerEntryProps = PropsWithChildren;

export type ServerEntryModule = {
  default(): VNode<ServerEntryProps>;
};

// Static
interface GetStaticPathsResult<Params extends Record<string, any>> {
  paths: Array<{ params: Params }>;
  fallback: boolean | "blocking";
}

export type GetStaticPathsFunction<Params extends Record<string, any>> = () => Promise<
  GetStaticPathsResult<Params>
>;

interface GetStaticPropsResult<Props> {
  props: Props;
  revalidate?: number;
}

export type GetStaticPropsFunction<
  Props extends Record<string, any> = {},
  Params extends GetStaticPathsResult = GetStaticPathsResult,
> = (context: { params: Params }) => Promise<GetStaticPropsResult<Props>>;

// Server Side
export type GetServerSidePropsFunction<Props extends Record<string, any> = {}> = (context: {
  event: H3Event<EventHandlerRequest>;
}) => Promise<Props>;

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

type InferStaticProps<F> = F extends (...args: any[]) => infer R
  ? Awaited<R> extends { props: infer P }
    ? P
    : never
  : never;

export type RouteRenderingKind = "static" | "server-side";

// Manifest
export type ServerManifestRoute = {
  path: string;
  module: string;
  absolute_module_path: string;
  props: Record<string, any>;
  static_generated_routes: Array<{
    path: string;
    props: Record<string, any>;
    revalidate: number;
  }>;
  rendering_kind: RouteRenderingKind;
  revalidate: number;
  is_dynamic: boolean;
  dynamic_params: Array<string>;
  css: string[];
};

export type SERVER_MANIFEST = {
  entry_server: string;
  routes: ServerManifestRoute[];
};

export type HydrateDataRoute = {
  path: string;
  module: string;
  props: Record<string, any>;
  rendering_kind: RouteRenderingKind;
  is_dynamic: boolean;
  css: string[];
  path_parsed_for_routing: string;
  static_generated_routes: Array<{ path: string; props: Record<string, any> }>;
};

export type HYDRATE_DATA = {
  routes: HydrateDataRoute[];
};

declare global {
  interface Window {
    __PRANX_HYDRATE_DATA__: HYDRATE_DATA;

    pranx: {
      csr_enabled: boolean;
    };
  }
}

// Config
export declare type PranxConfig = {
  /**
   * Enable client side routing.
   * If set to false, pranx don't will use `preact-iso` in the client for spa routing
   */
  csr?: boolean;
  /**
   * Extends esbuild config.
   */
  esbuild?: Pick<BuildOptions, "alias" | "define" | "plugins">;
};

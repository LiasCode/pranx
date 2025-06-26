import type { Handler } from "hono";
import type { VNode } from "preact";

import type { PageConfig } from "./router/next-file-base-router";

export type { PageConfig };

export type PrextHandler = Handler;

export type PrextPageModule = {
  default: () => VNode;
  config: PageConfig;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: () => GetStaticPaths;
  getServerSideProps?: GetServerSideProps;
};

export type GetStaticPropsResult<P extends Record<string, any> = Record<string, any>> = {
  props: P;
  revalidate?: number | false; // Not fully implemented in this example
  notFound?: boolean;
};

export type GetStaticProps = () => Promise<GetStaticPropsResult>;

export type GetStaticPaths = () => Promise<Array<{ paths: string[] }>>;

export type GetServerSideProps = <T>() => Promise<T>;

export interface HydrationData {
  pagePath: string;
  pageProps: Record<string, any>;
  pageMap: Record<string, string>; // Maps route -> client bundle path
}

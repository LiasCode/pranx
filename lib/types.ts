import type { Handler } from "hono";
import type { VNode } from "preact";

export type PranxHandler = Handler;

export type GetStaticPropsResult<P extends Record<string, any> = Record<string, any>> = {
  props: P;
  revalidate?: number | false; // Not fully implemented in this example
  notFound?: boolean;
};

export type GetStaticProps = () => Promise<GetStaticPropsResult>;

export type GetStaticPathsResult = Array<{ paths: string[] }>;

export type GetStaticPaths = () => Promise<GetStaticPathsResult>;

export type GetServerSideProps = <T>() => Promise<T>;

export type MetaFunctionReturn = VNode;

export type MetaFunction = () => Promise<MetaFunctionReturn>;

export interface HydrationData {
  pagePath: string;
  pageProps: Record<string, any>;
  pageMap: Record<string, string>; // Maps route -> client bundle path
}

export type PranxPageModule = {
  default: () => VNode;
  meta?: MetaFunction;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
  getServerSideProps?: GetServerSideProps;
};

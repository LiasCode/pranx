import type { Context, Handler } from "hono";
import type { VNode } from "preact";

export interface HydrationData {
  pages_map: Record<
    string,
    {
      entry_file: string;
      meta: string;
      props: Record<string, any>;
      isStatic: boolean;
      have_server_side_props: boolean;
    }
  >;
}

// page.tsx
export type PranxPageModule = {
  default: () => VNode;
};

// loader.ts
export type GetStaticPropsResult<P extends Record<string, any> = Record<string, any>> = {
  props: P;
  revalidate?: number | false;
  notFound?: boolean;
};

export type GetStaticProps = () => Promise<GetStaticPropsResult>;

export type GetStaticPathsResult = Array<{ paths: string[] }>;

export type GetStaticPaths = () => Promise<GetStaticPathsResult>;

export type GetServerSideProps = (c: Context) => Promise<Record<string, any>>;

export type PranxLoaderModule = {
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
  getServerSideProps?: GetServerSideProps;
};

// meta.ts
export type MetaFunctionReturn = VNode;

export type MetaFunction = () => Promise<MetaFunctionReturn>;

export type PranxMetaModule = {
  meta?: MetaFunction;
};

// route.ts
export type PranxHandler = Handler;

export type API_FILE_HANDLER_EXPORT_METHODS = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export type RouterComponent<H> = {
  file_path: string;
  exports: {
    methods?: {
      [T in API_FILE_HANDLER_EXPORT_METHODS]?: H;
    };
  };
};

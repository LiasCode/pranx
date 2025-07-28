import path from "node:path";
import type { PranxLoaderModule, PranxMetaModule, PranxPageModule } from "../types.js";
import { getModule } from "../utils/resolve.js";
import { CLIENT_OUTPUT_DIR, SERVER_OUTPUT_DIR } from "./constants.js";
import type { ProcessPagesOptions } from "./process_pages.js";

export type PagesGroupByPath = Map<
  string,
  {
    page?: {
      file: string;
      module: PranxPageModule;
    };
    loader?: {
      file: string;
      module: PranxLoaderModule;
    };
    meta?: {
      file: string;
      module: PranxMetaModule;
    };
    css?: {
      file: string;
    };
  }
>;

export async function group_pages_bundle_by_path(props: {
  pages: ProcessPagesOptions["pages_bundle_result"];
  server: ProcessPagesOptions["server_bundle_result"];
}): Promise<PagesGroupByPath> {
  const group: PagesGroupByPath = new Map();

  for (const file of Object.keys(props.pages.metafile.outputs)) {
    if (!isPage(file) && !isCss(file)) continue;

    const group_path = path.normalize(
      `/${path.relative(CLIENT_OUTPUT_DIR, extract_path_from_filename(file))}`
    );
    const file_path = path.normalize(`/${path.relative(group_path, file)}`);

    if (!group.has(group_path)) {
      group.set(group_path, {});
    }

    if (isCss(file)) {
      const prev = group.get(group_path);

      group.set(group_path, {
        ...prev,
        css: {
          file: file_path,
        },
      });
    }

    if (isPage(file)) {
      const prev = group.get(group_path);

      const pageModule = await getModule<PranxPageModule>(file_path);

      group.set(group_path, {
        ...prev,
        page: {
          file: file_path,
          module: {
            default: pageModule.default,
          },
        },
      });
    }
  }

  for (const file of Object.keys(props.server.metafile.outputs)) {
    if (!isLoader(file) && !isMeta(file)) continue;

    const group_path = path.normalize(
      `/${path.relative(SERVER_OUTPUT_DIR, extract_path_from_filename(file))}`
    );
    const file_path = path.normalize(`/${path.relative(group_path, file)}`);

    if (!group.has(group_path)) {
      group.set(group_path, {});
    }

    if (isLoader(file)) {
      const prev = group.get(group_path);

      const loaderModule = await getModule<PranxLoaderModule>(file_path);

      group.set(group_path, {
        ...prev,
        loader: {
          file: file_path,
          module: {
            getServerSideProps: loaderModule.getServerSideProps,
            getStaticPaths: loaderModule.getStaticPaths,
            getStaticProps: loaderModule.getStaticProps,
          },
        },
      });
    }

    if (isMeta(file)) {
      const prev = group.get(group_path);

      const metaModule = await getModule<PranxMetaModule>(file_path);

      group.set(group_path, {
        ...prev,
        meta: {
          file: file_path,
          module: {
            meta: metaModule.meta,
          },
        },
      });
    }
  }

  return group;
}

export const extract_path_from_filename = (file: string): string => {
  return path.dirname(file);
};

const isLoader = (filename: string) => filename.endsWith("loader.js");

const isPage = (filename: string) => filename.endsWith("page.js");

const isCss = (filename: string) => filename.endsWith(".css");

const isMeta = (filename: string) => filename.endsWith("meta.js");

import * as esbuild from "esbuild";
import * as fs from "node:fs/promises";
import path from "node:path";

// Component hierarchy
// The components defined in special files are rendered in a specific hierarchy:

// layout.js
// error.js (Preact Error boundary)
// loading.js (Preact Suspense boundary)
// not-found.js (Preact Error boundary)
// page.js or nested layout.js
// route.js or nested layout.js

export type HIERARCHY_COMPONENTS_KIND =
  | "LAYOUT"
  | "ERROR_BOUNDARY"
  | "NOT_FOUND"
  | "PAGE"
  | "API_HANDLER"
  | "LOADING";

export const HIERARCHY_COMPONENTS_FILE_NAMES: Record<HIERARCHY_COMPONENTS_KIND, string> = {
  LAYOUT: "layout",
  ERROR_BOUNDARY: "error",
  NOT_FOUND: "not-found",
  PAGE: "page",
  API_HANDLER: "route",
  LOADING: "loading",
};

export type API_FILE_HANDLER_EXPORT_METHODS = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export type RouterComponent<Handler, Page> = {
  // Path that will be used as http routing path;
  path: string;
  absolute_file_path: string;
  relative_file_path: string;
  filename: string;
  kind: HIERARCHY_COMPONENTS_KIND;
  exports: {
    methods?: {
      [T in API_FILE_HANDLER_EXPORT_METHODS]?: Handler;
    };
    default?: Page;
    config?: PageConfig;
  };
};

export type PageConfig = {
  static?: boolean;
};

type RoutableComponentFile<Handler, Page> = {
  default?: Page;
  config?: { static?: boolean };
} & {
  [K in API_FILE_HANDLER_EXPORT_METHODS]?: Handler;
};

export class NextFileRouter<HandlerFunctionT, PageFunctionT> {
  name?: string;
  readonly root: string;
  cached_router_components: RouterComponent<HandlerFunctionT, PageFunctionT>[] | null = null;

  readonly BASE_OUTPUT_PRANX_DIR = path.resolve(path.join(process.cwd(), ".pranx"));

  readonly BASE_OUTPUT_PRANX_UI_DIR = path.resolve(path.join(this.BASE_OUTPUT_PRANX_DIR, "routes"));

  constructor(config: { name?: string; root: string }) {
    this.name = config.name;
    this.root = config.root;
  }

  async preprocess(): Promise<void> {
    // Delete .pranx Dir
    await fs.rm(this.BASE_OUTPUT_PRANX_DIR, { force: true, recursive: true });

    const dir = await fs.readdir(this.root, {
      recursive: true,
      encoding: "utf8",
    });

    for (const file of dir) {
      if (!this.is_routable_component_file(file)) continue;

      try {
        const pathPopFileArr = file.split("/");
        pathPopFileArr.pop();
        const pathPopFile = pathPopFileArr.join("/");

        await esbuild.build({
          entryPoints: [path.resolve(path.join(this.root, file))],

          bundle: true,

          metafile: true,

          format: "esm",

          loader: {
            ".png": "dataurl",
            ".svg": "text",
            ".css": "css",
          },
          platform: "node",

          // logLevel: "verbose",
          color: true,

          // Minify
          minify: false,
          minifyWhitespace: false,
          minifySyntax: false,
          minifyIdentifiers: false,

          tsconfig: path.join(process.cwd(), "tsconfig.json"),
          outdir: path.join(this.BASE_OUTPUT_PRANX_UI_DIR, pathPopFile),
          packages: "external",
        });

        // console.dir(buildResult.metafile, {
        //   depth: Number.POSITIVE_INFINITY,
        //   compact: false,
        // });
      } catch (error) {
        console.error("[PRANX_PREPROCESSING_ERROR]", error);
      }
    }
  }

  async make(): Promise<RouterComponent<HandlerFunctionT, PageFunctionT>[]> {
    await this.preprocess();

    const router_components: RouterComponent<HandlerFunctionT, PageFunctionT>[] = [];

    const dir = await fs.readdir(this.BASE_OUTPUT_PRANX_UI_DIR, {
      recursive: true,
      encoding: "utf8",
    });

    for (const file of dir) {
      if (!this.is_routable_component_file(file)) continue;

      let import_file: RoutableComponentFile<HandlerFunctionT, PageFunctionT> = {};

      try {
        import_file = await import(path.resolve(this.BASE_OUTPUT_PRANX_UI_DIR, file));
      } catch (error) {
        console.error("[PRANX_PREPROCESSING_ERROR]-[IMPORTING_FILE_ERROR]", error);
      }

      const component = this.create_route_from_imported_route_file(import_file, file);

      router_components.push(component);
    }

    this.cached_router_components = router_components;
    return router_components;
  }

  private is_routable_component_file(filename: string): boolean {
    if (!this.is_file_importable(filename)) return false;
    return true;
  }

  private is_file_importable(filename: string): boolean {
    if (filename.endsWith(".d.ts")) return false;
    if (filename.endsWith(".test.ts") || filename.endsWith(".test.js")) return false;
    if (filename.endsWith(".spec.ts") || filename.endsWith(".spec.js")) return false;
    if (filename.endsWith(".json")) return false;

    const path_steps = filename.split("/").filter((p) => p !== "/");

    const last_step = path_steps.at(-1);

    if (!last_step) throw new Error("FILENAME MALFORMED");

    const filenameWithOutExtension = last_step.split(".")[0];

    if (!filenameWithOutExtension) throw new Error("FILENAME MALFORMED");

    if (this.resolve_file_kind(filenameWithOutExtension) === null) return false;

    return (
      filename.endsWith("ts") ||
      filename.endsWith("tsx") ||
      filename.endsWith("js") ||
      filename.endsWith("jsx")
    );
  }

  private create_route_from_imported_route_file(
    import_file: RoutableComponentFile<HandlerFunctionT, PageFunctionT>,
    filename: string
  ): RouterComponent<HandlerFunctionT, PageFunctionT> {
    let parsed_filename = "";

    if (!filename.startsWith("/")) {
      parsed_filename = `/${filename}`;
    }

    const path_steps = parsed_filename.split("/").filter((p) => p !== "/");

    const last_step = path_steps.at(-1);

    if (!last_step) throw new Error("FILENAME MALFORMED");

    const filenameWithOutExtension = last_step.split(".")[0];

    if (!filenameWithOutExtension) throw new Error("FILENAME MALFORMED");

    path_steps[path_steps.length - 1] =
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.PAGE ||
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.API_HANDLER ||
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.LAYOUT ||
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.ERROR_BOUNDARY ||
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.NOT_FOUND ||
      filenameWithOutExtension === HIERARCHY_COMPONENTS_FILE_NAMES.LOADING
        ? ""
        : filenameWithOutExtension;

    const final_path = `${path_steps.join("/")}`;

    const component_kind = this.resolve_file_kind(filenameWithOutExtension);

    if (component_kind === null) throw new Error("Component Kind can't be null");

    return {
      path: final_path,
      filename: last_step,
      absolute_file_path: path.resolve(path.join(this.BASE_OUTPUT_PRANX_UI_DIR, parsed_filename)),
      relative_file_path: parsed_filename,
      kind: component_kind,
      exports: {
        methods: {
          GET: import_file.GET || undefined,
          POST: import_file.POST || undefined,
          PUT: import_file.PUT || undefined,
          PATCH: import_file.PATCH || undefined,
          DELETE: import_file.DELETE || undefined,
        },
        default: import_file.default || undefined,
        config: {
          static: true,
          ...import_file.config,
        },
      },
    };
  }

  private resolve_file_kind(filename: string): HIERARCHY_COMPONENTS_KIND | null {
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.PAGE) return "PAGE";
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.API_HANDLER) return "API_HANDLER";
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.ERROR_BOUNDARY) return "ERROR_BOUNDARY";
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.LAYOUT) return "LAYOUT";
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.NOT_FOUND) return "NOT_FOUND";
    if (filename === HIERARCHY_COMPONENTS_FILE_NAMES.LOADING) return "LOADING";

    return null;
  }

  toJson(pretty = true): string {
    return JSON.stringify(this.cached_router_components, null, pretty ? 2 : 0);
  }
}

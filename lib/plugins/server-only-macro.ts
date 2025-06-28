import type * as esbuild from "esbuild";
import * as fs from "node:fs/promises";

const SERVER_TAG_OPEN = "// ONLY SERVER OPEN";
const SERVER_TAG_CLOSE = "// ONLY SERVER END";

export const server_only_macro_plugin = (): esbuild.Plugin => {
  return {
    name: "strip-server-exports",
    setup(build) {
      build.onLoad({ filter: /\.(jsx|tsx)$/, namespace: "file" }, async (args) => {
        let contents = await fs.readFile(args.path, "utf8");

        // Regex to find and remove content between SERVER_TAG_OPEN and SERVER_TAG_CLOSE
        // - (?:^|\s*)               : Matches start of line or whitespace (optional, for cleaner matching)
        // - ${SERVER_TAG_OPEN.replace(/\//g, '\\/')}: Matches the opening tag, escaping slashes
        // - [\\s\\S]*?             : Non-greedy match for ANY character (including newlines)
        // - ${SERVER_TAG_CLOSE.replace(/\//g, '\\/')}: Matches the closing tag
        // - (?:$|\s*)               : Matches end of line or whitespace (optional)
        const stripRegex = new RegExp(
          `(?:^|\\s*)${SERVER_TAG_OPEN.replace(/\//g, "\\/")}[\\s\\S]*?${SERVER_TAG_CLOSE.replace(/\//g, "\\/")}(?:$|\\s*)`,
          "gm" // g for global (find all occurrences), m for multiline (allow ^ and $ to match line breaks)
        );

        // Replace all matched blocks with an empty string or a comment
        contents = contents.replace(stripRegex, (_) => "// Pranx: Server-side block removed.\n");

        return {
          contents,
          loader: args.path.endsWith(".tsx") ? "tsx" : "jsx",
        };
      });
    },
  };
};

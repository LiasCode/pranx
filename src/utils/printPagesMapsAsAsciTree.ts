import kleur from "kleur";
import { SERVER_OUTPUT_DIR } from "../build/constants.js";
import type { InternalPageMapResult } from "../build/generate_pages_map.js";
import { Logger } from "../logger/index.js";
import type { RouterComponent } from "../types.js";
import { filePathToRoutingPath } from "./filePathToRoutingPath.js";

export const printPagesMapsAsAsciTree = async (info: {
  page_map_internal: InternalPageMapResult;
  handlers: RouterComponent<any>[];
}) => {
  Logger.info(kleur.underline("Server:"));

  for (let index = 0; index < info.handlers.length; index++) {
    const h = info.handlers[index];

    if (!h) throw new Error("h must exists");

    const path = filePathToRoutingPath(h.file_path.replace(SERVER_OUTPUT_DIR, ""), false);

    console.log(
      `${index === 0 ? "┌" : index === info.handlers.length - 1 ? "└" : "├"} ƒ ${path} (${Object.keys(h?.exports?.methods || {}).toString()})`
    );
  }

  Logger.info(kleur.underline("Pages:"));

  const pagesEntries = Object.entries(info.page_map_internal);

  for (let index = 0; index < pagesEntries.length; index++) {
    const pageData = pagesEntries[index];

    if (!pageData) throw new Error("pageData must exists");

    const [path, page_data] = pageData;

    console.log(
      `${index === 0 ? "┌" : index === pagesEntries.length - 1 ? "└" : "├"} ${page_data.isStatic ? "○" : "ƒ"} ${filePathToRoutingPath(path, false)} `
    );
  }

  console.log(
    "\n○ (Static)  prerendered as static content \nƒ (Dynamic) server-rendered on demand\n"
  );
};

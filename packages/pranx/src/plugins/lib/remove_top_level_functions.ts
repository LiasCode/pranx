import { parse } from "@babel/parser";
import MagicString from "magic-string";

/**
 * Remove top-level function declarations whose names are listed in namesToRemove.
 * @param code_src - source code (JSX/ESM)
 * @param ids_to_remove - list of top-level function names to remove
 * @returns modified source
 */
export function remove_top_level_functions(code_src: string, ids_to_remove: string[]) {
  const ast = parse(code_src, {
    sourceType: "module",
    plugins: ["jsx", "classProperties", "optionalChaining", "typescript"],
  });

  const ms = new MagicString(code_src);

  // Collect nodes to remove (AST nodes must have .start and .end)
  const nodes_to_remove = [];

  // Walk only top-level Program.body (no deep traversal required)
  const program_body = ast.program?.body ? ast.program.body : [];

  for (const node of program_body) {
    // Case A: export function name() { ... }
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration &&
      node.declaration.type === "FunctionDeclaration" &&
      node.declaration.id &&
      ids_to_remove.includes(node.declaration.id.name)
    ) {
      // Remove the whole ExportNamedDeclaration so we remove both export token
      // and the function declaration.
      if (node.start != null && node.end != null) nodes_to_remove.push(node);
      continue;
    }

    // Case B: function name() { ... } (top-level)
    if (node.type === "FunctionDeclaration" && node.id && ids_to_remove.includes(node.id.name)) {
      if (node.start != null && node.end != null) nodes_to_remove.push(node);
      continue;
    }

    // Case C: export const name = () => { ... }
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration &&
      node.declaration.type === "VariableDeclaration" &&
      // @ts-expect-error
      ids_to_remove.includes(node.declaration.declarations[0].id.name)
    ) {
      // Remove the whole ExportNamedDeclaration so we remove both export token
      // and the function declaration.
      if (node.start != null && node.end != null) nodes_to_remove.push(node);
      continue;
    }

    // Case D: export const name = () => { ... }
    if (
      node.type === "VariableDeclaration" &&
      // @ts-expect-error
      ids_to_remove.includes(node.declarations[0].id.name)
    ) {
      // Remove the whole ExportNamedDeclaration so we remove both export token
      // and the function declaration.
      if (node.start != null && node.end != null) nodes_to_remove.push(node);
    }
  }

  // Remove nodes from end->start to keep start/end indices valid for MagicString
  const sorted_nodes = nodes_to_remove.sort((a, b) => (b.start ?? 0) - (a.start ?? 0));
  for (const n of sorted_nodes) {
    if (n.start != null && n.end != null) {
      ms.remove(n.start, n.end);
    }
  }

  return ms.toString().trim();
}

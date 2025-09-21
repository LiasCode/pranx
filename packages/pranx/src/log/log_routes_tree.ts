/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import kleur from "kleur";
import type { ServerManifestRoute } from "types";
import { logger } from "./logger";

type LogRouteKind = "static" | "static-dynamic" | "server-side";

type FlatRoute = Pick<ServerManifestRoute, "path"> & { kind: LogRouteKind };

type TrieNode = {
  name: string; // segment name ('' at root)
  fullPath: string; // accumulated path
  kind?: LogRouteKind; // only set on leaf route nodes
  children: Map<string, TrieNode>;
};

const ICONS = {
  server: () => kleur.yellow("λ"),
  static: () => kleur.white("○"),
  staticDyn: () => kleur.white("●"),
  folder: () => kleur.white("┬"),
};

const getKindIcon = (kind: LogRouteKind) =>
  kind === "server-side" ? ICONS.server() : kind === "static" ? ICONS.static() : ICONS.staticDyn();

export function log_routes_tree(input_routes: ServerManifestRoute[]) {
  const flat = flattenRoutes(input_routes);

  // Sort lexicographically for stable grouping.
  flat.sort((a, b) => a.path.localeCompare(b.path));

  // Build trie.
  const root: TrieNode = { name: "", fullPath: "", children: new Map() };
  for (const r of flat) insertIntoTrie(root, r);

  // Header.
  logger.log(kleur.bold().blue().underline("Routes"));
  logger.log(".");

  // Render.
  renderTrie(root, []);

  // Legend.
  logger.log("");
  logger.log(`${ICONS.server()} Server-side`);
  logger.log(`${ICONS.static()} Static`);
  logger.log(`${ICONS.staticDyn()} Static (pre-expanded variants)`);
}

function flattenRoutes(input: ServerManifestRoute[]): FlatRoute[] {
  const out: FlatRoute[] = [];
  for (const r of input) {
    if (r.rendering_kind === "static" && r.static_generated_routes.length > 0) {
      for (const sr of r.static_generated_routes) {
        out.push({ path: sr.path, kind: "static-dynamic" });
      }
    } else {
      out.push({ path: r.path, kind: r.rendering_kind as LogRouteKind });
    }
  }
  return out;
}

function insertIntoTrie(root: TrieNode, r: FlatRoute) {
  const segments = r.path.split("/").filter(Boolean); // ignore leading '/'
  let node = root;
  let acc = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    acc = acc === "" ? `/${seg}` : `${acc}/${seg}`;
    if (!seg) {
      continue;
    }
    if (!node.children.has(seg)) {
      node.children.set(seg, { name: seg, fullPath: acc, children: new Map() });
    }
    node = node.children.get(seg)!;
    if (i === segments.length - 1) node.kind = r.kind;
  }
}

/**
 * Render the trie using box-drawing characters.
 * Additionally, group numeric leaf siblings into compact ranges.
 */
function renderTrie(node: TrieNode, prefixBits: boolean[]) {
  // Collect children into an array for deterministic index access.
  const children = Array.from(node.children.values());

  // Optional numeric range grouping applied at this directory level.
  const [numericLeaves, others] = partition(children, (c) => isNumericLeaf(c));
  const numericRanges = compressNumericLeaves(numericLeaves);

  // Prepare final render list with synthetic "range nodes".
  type RenderItem = { label: string; icon: string; isLeaf: boolean; child?: TrieNode };
  const renderItems: RenderItem[] = [];

  // Folders and non-numeric leaves first, sorted by type then name.
  others.sort(byFolderThenName).forEach((child) => {
    const isLeaf = child.kind != null && child.children.size === 0;
    renderItems.push({
      label: isLeaf ? kleur.white(child.name) : kleur.cyan(child.name),
      icon: isLeaf ? getKindIcon(child.kind!) : ICONS.folder(),
      isLeaf,
      child,
    });
  });

  // Then numeric ranges, already compressed.
  for (const rng of numericRanges) {
    const label = rng.single ? `${rng.base}/${rng.single}` : `${rng.base}/${rng.start}…${rng.end}`;
    renderItems.push({
      label: kleur.white(label.replace(node.fullPath || "", "").replace(/^\//, "")),
      icon: ICONS.staticDyn(), // numeric expansions typically come from static-dynamic
      isLeaf: true,
      child: undefined,
    });
  }

  // Emit lines.
  for (let i = 0; i < renderItems.length; i++) {
    const it = renderItems[i];
    const last = i === renderItems.length - 1;

    if (!it) {
      continue;
    }

    const branch = last ? "└─" : "├─";
    const guide = prefixBits.map((b) => (b ? "│ " : "  ")).join("");

    logger.log(`${guide}${branch}${it.icon} ${it.label}`);

    // Recurse into directories.
    if (!it.isLeaf && it.child) {
      renderTrie(it.child, [...prefixBits, !last]);
    }
  }
}

function byFolderThenName(a: TrieNode, b: TrieNode) {
  const aIsFolder = a.children.size > 0 && a.kind == null;
  const bIsFolder = b.children.size > 0 && b.kind == null;
  if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
  return a.name.localeCompare(b.name);
}

function partition<T>(arr: T[], pred: (x: T) => boolean): [T[], T[]] {
  const t: T[] = [],
    f: T[] = [];
  for (const x of arr) (pred(x) ? t : f).push(x);
  return [t, f];
}

function isNumericLeaf(n: TrieNode): boolean {
  if (n.children.size !== 0) return false;
  if (n.kind == null) return false;
  return /^\d+$/.test(n.name);
}

type NumericRange = { base: string; start: number; end: number; single?: number };

/**
 * Group numeric leaves like /posts/1, /posts/2, /posts/3 into compact ranges.
 * We assume all nodes share the same base = parent.fullPath.
 */
function compressNumericLeaves(nodes: TrieNode[]): NumericRange[] {
  if (nodes.length === 0) return [];
  // Base is parent path. All siblings share it.
  //@ts-expect-error
  const base = nodes[0].fullPath.replace(/\/\d+$/, "");
  const nums = nodes.map((n) => parseInt(n.name, 10)).sort((a, b) => a - b);

  const ranges: NumericRange[] = [];
  let s = nums[0]!;
  let prev = nums[0]!;

  for (let i = 1; i <= nums.length; i++) {
    const cur = nums[i]!;
    const contiguous = cur === prev + 1;
    if (!contiguous) {
      if (s === prev) ranges.push({ base, start: s, end: s, single: s });
      else ranges.push({ base, start: s, end: prev });
      s = cur;
    }
    prev = cur!;
  }
  return ranges;
}

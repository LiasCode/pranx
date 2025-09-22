// @ts-nocheck
/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <> */

export const exec_route_match = (url: string, route: string, matches = {}) => {
  url = url.split("/").filter(Boolean);
  route = (route || "").split("/").filter(Boolean);
  if (!matches.params) matches.params = {};
  for (let i = 0, val, rest; i < Math.max(url.length, route.length); i++) {
    const [, m, param, flag] = (route[i] || "").match(/^(:?)(.*?)([+*?]?)$/);
    val = url[i];
    // segment match:
    if (!m && param === val) continue;
    // /foo/* match
    if (!m && val && flag === "*") {
      matches.rest = `/${url.slice(i).map(decodeURIComponent).join("/")}`;
      break;
    }
    // segment mismatch / missing required field:
    if (!m || (!val && flag !== "?" && flag !== "*")) return;
    rest = flag === "+" || flag === "*";
    // rest (+/*) match:
    if (rest) val = url.slice(i).map(decodeURIComponent).join("/") || undefined;
    // normal/optional field:
    else if (val) val = decodeURIComponent(val);
    matches.params[param] = val;
    if (!(param in matches)) matches[param] = val;
    if (rest) break;
  }
  return matches;
};

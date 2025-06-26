import { Fragment as e, options as r } from "preact";
export { Fragment } from "preact";
export { u as jsx, l as jsxAttr, u as jsxDEV, s as jsxEscape, u as jsxs, a as jsxTemplate };
const t = /["&<]/;
function n(r) {
  if (0 === r.length || !1 === t.test(r)) return r;
  for (let e = 0, n = 0, o = "", f = ""; n < r.length; n++) {
    switch (r.charCodeAt(n)) {
      case 34:
        f = "&quot;";
        break;
      case 38:
        f = "&amp;";
        break;
      case 60:
        f = "&lt;";
        break;
      default:
        continue;
    }
    n !== e && (o += r.slice(e, n)), (o += f), (e = n + 1);
  }
  return n !== e && (o += r.slice(e, n)), o;
}
let o = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
let f = 0;
const i = Array.isArray;
function u(e, t, n, o, i, u) {
  t || (t = {});
  let a;
  let c;
  let p = t;
  if ("ref" in p) for (c in ((p = {}), t)) "ref" === c ? (a = t[c]) : (p[c] = t[c]);
  const l = {
    type: e,
    props: p,
    key: n,
    ref: a,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: --f,
    __i: -1,
    __u: 0,
    __source: i,
    __self: u,
  };
  if ("function" === typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
  return r.vnode?.(l), l;
}
function a(r) {
  const t = u(e, { tpl: r, exprs: [].slice.call(arguments, 1) });
  return (t.key = t.__v), t;
}
const c = {};
const p = /[A-Z]/g;
function l(e, t) {
  if (r.attr) {
    const f = r.attr(e, t);
    if ("string" === typeof f) return f;
  }
  if (
    ((t = ((r) => (null !== r && "object" === typeof r && "function" === typeof r.valueOf ? r.valueOf() : r))(t)),
    "ref" === e || "key" === e)
  )
    return "";
  if ("style" === e && "object" === typeof t) {
    let i = "";
    for (const u in t) {
      const a = t[u];
      if (null != a && "" !== a) {
        const l = "-" === u[0] ? u : c[u] || (c[u] = u.replace(p, "-$&").toLowerCase());
        let s = ";";
        "number" !== typeof a || l.startsWith("--") || o.test(l) || (s = "px;"), (i = `${i + l}:${a}${s}`);
      }
    }
    return `${e}="${n(i)}"`;
  }
  return null == t || !1 === t || "function" === typeof t || "object" === typeof t
    ? ""
    : !0 === t
      ? e
      : `${e}="${n(`${t}`)}"`;
}
function s(r) {
  if (null == r || "boolean" === typeof r || "function" === typeof r) return null;
  if ("object" === typeof r) {
    if (void 0 === r.constructor) return r;
    if (i(r)) {
      for (let e = 0; e < r.length; e++) r[e] = s(r[e]);
      return r;
    }
  }
  return n(`${r}`);
} //# sourceMappingURL=jsxRuntime.module.js.map

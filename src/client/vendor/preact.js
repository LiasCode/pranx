var n,
  l,
  u,
  t,
  i,
  r,
  o,
  e,
  f,
  c,
  s,
  a,
  h,
  p = {},
  v = [],
  y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  w = Array.isArray;
function d(n, l) {
  for (var u in l) n[u] = l[u];
  return n;
}
function g(n) {
  n && n.parentNode && n.parentNode.removeChild(n);
}
function _(l, u, t) {
  var i,
    r,
    o,
    e = {};
  for (o in u) "key" == o ? (i = u[o]) : "ref" == o ? (r = u[o]) : (e[o] = u[o]);
  if (
    (arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : t),
    "function" == typeof l && null != l.defaultProps)
  )
    for (o in l.defaultProps) void 0 === e[o] && (e[o] = l.defaultProps[o]);
  return m(l, e, i, r, null);
}
function m(n, t, i, r, o) {
  var e = {
    type: n,
    props: t,
    key: i,
    ref: r,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: null == o ? ++u : o,
    __i: -1,
    __u: 0,
  };
  return (null == o && null != l.vnode && l.vnode(e), e);
}
function b() {
  return { current: null };
}
function k(n) {
  return n.children;
}
function x(n, l) {
  ((this.props = n), (this.context = l));
}
function S(n, l) {
  if (null == l) return n.__ ? S(n.__, n.__i + 1) : null;
  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
  return "function" == typeof n.type ? S(n) : null;
}
function C(n) {
  var l, u;
  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
      if (null != (u = n.__k[l]) && null != u.__e) {
        n.__e = n.__c.base = u.__e;
        break;
      }
    return C(n);
  }
}
function M(n) {
  ((!n.__d && (n.__d = !0) && i.push(n) && !$.__r++) || r != l.debounceRendering) &&
    ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n, u, t, r, o, f, c, s = 1; i.length; )
    (i.length > s && i.sort(e),
      (n = i.shift()),
      (s = i.length),
      n.__d &&
        ((t = void 0),
        (o = (r = (u = n).__v).__e),
        (f = []),
        (c = []),
        u.__P &&
          (((t = d({}, r)).__v = r.__v + 1),
          l.vnode && l.vnode(t),
          O(
            u.__P,
            t,
            r,
            u.__n,
            u.__P.namespaceURI,
            32 & r.__u ? [o] : null,
            f,
            null == o ? S(r) : o,
            !!(32 & r.__u),
            c
          ),
          (t.__v = r.__v),
          (t.__.__k[t.__i] = t),
          N(f, t, c),
          t.__e != o && C(t))));
  $.__r = 0;
}
function I(n, l, u, t, i, r, o, e, f, c, s) {
  var a,
    h,
    y,
    w,
    d,
    g,
    _ = (t && t.__k) || v,
    m = l.length;
  for (f = P(u, l, _, f, m), a = 0; a < m; a++)
    null != (y = u.__k[a]) &&
      ((h = -1 == y.__i ? p : _[y.__i] || p),
      (y.__i = a),
      (g = O(n, y, h, i, r, o, e, f, c, s)),
      (w = y.__e),
      y.ref && h.ref != y.ref && (h.ref && B(h.ref, null, y), s.push(y.ref, y.__c || w, y)),
      null == d && null != w && (d = w),
      4 & y.__u || h.__k === y.__k
        ? (f = A(y, f, n))
        : "function" == typeof y.type && void 0 !== g
          ? (f = g)
          : w && (f = w.nextSibling),
      (y.__u &= -7));
  return ((u.__e = d), f);
}
function P(n, l, u, t, i) {
  var r,
    o,
    e,
    f,
    c,
    s = u.length,
    a = s,
    h = 0;
  for (n.__k = new Array(i), r = 0; r < i; r++)
    null != (o = l[r]) && "boolean" != typeof o && "function" != typeof o
      ? ((f = r + h),
        ((o = n.__k[r] =
          "string" == typeof o ||
          "number" == typeof o ||
          "bigint" == typeof o ||
          o.constructor == String
            ? m(null, o, null, null, null)
            : w(o)
              ? m(k, { children: o }, null, null, null)
              : null == o.constructor && o.__b > 0
                ? m(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v)
                : o).__ = n),
        (o.__b = n.__b + 1),
        (e = null),
        -1 != (c = o.__i = L(o, u, f, a)) && (a--, (e = u[c]) && (e.__u |= 2)),
        null == e || null == e.__v
          ? (-1 == c && (i > s ? h-- : i < s && h++), "function" != typeof o.type && (o.__u |= 4))
          : c != f && (c == f - 1 ? h-- : c == f + 1 ? h++ : (c > f ? h-- : h++, (o.__u |= 4))))
      : (n.__k[r] = null);
  if (a)
    for (r = 0; r < s; r++)
      null != (e = u[r]) && 0 == (2 & e.__u) && (e.__e == t && (t = S(e)), D(e, e));
  return t;
}
function A(n, l, u) {
  var t, i;
  if ("function" == typeof n.type) {
    for (t = n.__k, i = 0; t && i < t.length; i++) t[i] && ((t[i].__ = n), (l = A(t[i], l, u)));
    return l;
  }
  n.__e != l &&
    (l && n.type && !u.contains(l) && (l = S(n)), u.insertBefore(n.__e, l || null), (l = n.__e));
  do {
    l = l && l.nextSibling;
  } while (null != l && 8 == l.nodeType);
  return l;
}
function H(n, l) {
  return (
    (l = l || []),
    null == n ||
      "boolean" == typeof n ||
      (w(n)
        ? n.some(function (n) {
            H(n, l);
          })
        : l.push(n)),
    l
  );
}
function L(n, l, u, t) {
  var i,
    r,
    o,
    e = n.key,
    f = n.type,
    c = l[u],
    s = null != c && 0 == (2 & c.__u);
  if ((null === c && null == n.key) || (s && e == c.key && f == c.type)) return u;
  if (t > (s ? 1 : 0))
    for (i = u - 1, r = u + 1; i >= 0 || r < l.length; )
      if (
        null != (c = l[(o = i >= 0 ? i-- : r++)]) &&
        0 == (2 & c.__u) &&
        e == c.key &&
        f == c.type
      )
        return o;
  return -1;
}
function T(n, l, u) {
  "-" == l[0]
    ? n.setProperty(l, null == u ? "" : u)
    : (n[l] = null == u ? "" : "number" != typeof u || y.test(l) ? u : u + "px");
}
function j(n, l, u, t, i) {
  var r, o;
  n: if ("style" == l)
    if ("string" == typeof u) n.style.cssText = u;
    else {
      if (("string" == typeof t && (n.style.cssText = t = ""), t))
        for (l in t) (u && l in u) || T(n.style, l, "");
      if (u) for (l in u) (t && u[l] == t[l]) || T(n.style, l, u[l]);
    }
  else if ("o" == l[0] && "n" == l[1])
    ((r = l != (l = l.replace(f, "$1"))),
      (o = l.toLowerCase()),
      (l = o in n || "onFocusOut" == l || "onFocusIn" == l ? o.slice(2) : l.slice(2)),
      n.l || (n.l = {}),
      (n.l[l + r] = u),
      u
        ? t
          ? (u.u = t.u)
          : ((u.u = c), n.addEventListener(l, r ? a : s, r))
        : n.removeEventListener(l, r ? a : s, r));
  else {
    if ("http://www.w3.org/2000/svg" == i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      "width" != l &&
      "height" != l &&
      "href" != l &&
      "list" != l &&
      "form" != l &&
      "tabIndex" != l &&
      "download" != l &&
      "rowSpan" != l &&
      "colSpan" != l &&
      "role" != l &&
      "popover" != l &&
      l in n
    )
      try {
        n[l] = null == u ? "" : u;
        break n;
      } catch (n) {}
    "function" == typeof u ||
      (null == u || (!1 === u && "-" != l[4])
        ? n.removeAttribute(l)
        : n.setAttribute(l, "popover" == l && 1 == u ? "" : u));
  }
}
function F(n) {
  return function (u) {
    if (this.l) {
      var t = this.l[u.type + n];
      if (null == u.t) u.t = c++;
      else if (u.t < t.u) return;
      return t(l.event ? l.event(u) : u);
    }
  };
}
function O(n, u, t, i, r, o, e, f, c, s) {
  var a,
    h,
    p,
    v,
    y,
    _,
    m,
    b,
    S,
    C,
    M,
    $,
    P,
    A,
    H,
    L,
    T,
    j = u.type;
  if (null != u.constructor) return null;
  (128 & t.__u && ((c = !!(32 & t.__u)), (o = [(f = u.__e = t.__e)])), (a = l.__b) && a(u));
  n: if ("function" == typeof j)
    try {
      if (
        ((b = u.props),
        (S = "prototype" in j && j.prototype.render),
        (C = (a = j.contextType) && i[a.__c]),
        (M = a ? (C ? C.props.value : a.__) : i),
        t.__c
          ? (m = (h = u.__c = t.__c).__ = h.__E)
          : (S
              ? (u.__c = h = new j(b, M))
              : ((u.__c = h = new x(b, M)), (h.constructor = j), (h.render = E)),
            C && C.sub(h),
            (h.props = b),
            h.state || (h.state = {}),
            (h.context = M),
            (h.__n = i),
            (p = h.__d = !0),
            (h.__h = []),
            (h._sb = [])),
        S && null == h.__s && (h.__s = h.state),
        S &&
          null != j.getDerivedStateFromProps &&
          (h.__s == h.state && (h.__s = d({}, h.__s)),
          d(h.__s, j.getDerivedStateFromProps(b, h.__s))),
        (v = h.props),
        (y = h.state),
        (h.__v = u),
        p)
      )
        (S &&
          null == j.getDerivedStateFromProps &&
          null != h.componentWillMount &&
          h.componentWillMount(),
          S && null != h.componentDidMount && h.__h.push(h.componentDidMount));
      else {
        if (
          (S &&
            null == j.getDerivedStateFromProps &&
            b !== v &&
            null != h.componentWillReceiveProps &&
            h.componentWillReceiveProps(b, M),
          (!h.__e &&
            null != h.shouldComponentUpdate &&
            !1 === h.shouldComponentUpdate(b, h.__s, M)) ||
            u.__v == t.__v)
        ) {
          for (
            u.__v != t.__v && ((h.props = b), (h.state = h.__s), (h.__d = !1)),
              u.__e = t.__e,
              u.__k = t.__k,
              u.__k.some(function (n) {
                n && (n.__ = u);
              }),
              $ = 0;
            $ < h._sb.length;
            $++
          )
            h.__h.push(h._sb[$]);
          ((h._sb = []), h.__h.length && e.push(h));
          break n;
        }
        (null != h.componentWillUpdate && h.componentWillUpdate(b, h.__s, M),
          S &&
            null != h.componentDidUpdate &&
            h.__h.push(function () {
              h.componentDidUpdate(v, y, _);
            }));
      }
      if (((h.context = M), (h.props = b), (h.__P = n), (h.__e = !1), (P = l.__r), (A = 0), S)) {
        for (
          h.state = h.__s, h.__d = !1, P && P(u), a = h.render(h.props, h.state, h.context), H = 0;
          H < h._sb.length;
          H++
        )
          h.__h.push(h._sb[H]);
        h._sb = [];
      } else
        do {
          ((h.__d = !1), P && P(u), (a = h.render(h.props, h.state, h.context)), (h.state = h.__s));
        } while (h.__d && ++A < 25);
      ((h.state = h.__s),
        null != h.getChildContext && (i = d(d({}, i), h.getChildContext())),
        S && !p && null != h.getSnapshotBeforeUpdate && (_ = h.getSnapshotBeforeUpdate(v, y)),
        (L = a),
        null != a && a.type === k && null == a.key && (L = V(a.props.children)),
        (f = I(n, w(L) ? L : [L], u, t, i, r, o, e, f, c, s)),
        (h.base = u.__e),
        (u.__u &= -161),
        h.__h.length && e.push(h),
        m && (h.__E = h.__ = null));
    } catch (n) {
      if (((u.__v = null), c || null != o))
        if (n.then) {
          for (u.__u |= c ? 160 : 128; f && 8 == f.nodeType && f.nextSibling; ) f = f.nextSibling;
          ((o[o.indexOf(f)] = null), (u.__e = f));
        } else {
          for (T = o.length; T--; ) g(o[T]);
          z(u);
        }
      else ((u.__e = t.__e), (u.__k = t.__k), n.then || z(u));
      l.__e(n, u, t);
    }
  else
    null == o && u.__v == t.__v
      ? ((u.__k = t.__k), (u.__e = t.__e))
      : (f = u.__e = q(t.__e, u, t, i, r, o, e, c, s));
  return ((a = l.diffed) && a(u), 128 & u.__u ? void 0 : f);
}
function z(n) {
  (n && n.__c && (n.__c.__e = !0), n && n.__k && n.__k.forEach(z));
}
function N(n, u, t) {
  for (var i = 0; i < t.length; i++) B(t[i], t[++i], t[++i]);
  (l.__c && l.__c(u, n),
    n.some(function (u) {
      try {
        ((n = u.__h),
          (u.__h = []),
          n.some(function (n) {
            n.call(u);
          }));
      } catch (n) {
        l.__e(n, u.__v);
      }
    }));
}
function V(n) {
  return "object" != typeof n || null == n || (n.__b && n.__b > 0) ? n : w(n) ? n.map(V) : d({}, n);
}
function q(u, t, i, r, o, e, f, c, s) {
  var a,
    h,
    v,
    y,
    d,
    _,
    m,
    b = i.props,
    k = t.props,
    x = t.type;
  if (
    ("svg" == x
      ? (o = "http://www.w3.org/2000/svg")
      : "math" == x
        ? (o = "http://www.w3.org/1998/Math/MathML")
        : o || (o = "http://www.w3.org/1999/xhtml"),
    null != e)
  )
    for (a = 0; a < e.length; a++)
      if ((d = e[a]) && "setAttribute" in d == !!x && (x ? d.localName == x : 3 == d.nodeType)) {
        ((u = d), (e[a] = null));
        break;
      }
  if (null == u) {
    if (null == x) return document.createTextNode(k);
    ((u = document.createElementNS(o, x, k.is && k)),
      c && (l.__m && l.__m(t, e), (c = !1)),
      (e = null));
  }
  if (null == x) b === k || (c && u.data == k) || (u.data = k);
  else {
    if (((e = e && n.call(u.childNodes)), (b = i.props || p), !c && null != e))
      for (b = {}, a = 0; a < u.attributes.length; a++) b[(d = u.attributes[a]).name] = d.value;
    for (a in b)
      if (((d = b[a]), "children" == a));
      else if ("dangerouslySetInnerHTML" == a) v = d;
      else if (!(a in k)) {
        if (("value" == a && "defaultValue" in k) || ("checked" == a && "defaultChecked" in k))
          continue;
        j(u, a, null, d, o);
      }
    for (a in k)
      ((d = k[a]),
        "children" == a
          ? (y = d)
          : "dangerouslySetInnerHTML" == a
            ? (h = d)
            : "value" == a
              ? (_ = d)
              : "checked" == a
                ? (m = d)
                : (c && "function" != typeof d) || b[a] === d || j(u, a, d, b[a], o));
    if (h)
      (c || (v && (h.__html == v.__html || h.__html == u.innerHTML)) || (u.innerHTML = h.__html),
        (t.__k = []));
    else if (
      (v && (u.innerHTML = ""),
      I(
        "template" == t.type ? u.content : u,
        w(y) ? y : [y],
        t,
        i,
        r,
        "foreignObject" == x ? "http://www.w3.org/1999/xhtml" : o,
        e,
        f,
        e ? e[0] : i.__k && S(i, 0),
        c,
        s
      ),
      null != e)
    )
      for (a = e.length; a--; ) g(e[a]);
    c ||
      ((a = "value"),
      "progress" == x && null == _
        ? u.removeAttribute("value")
        : null != _ &&
          (_ !== u[a] || ("progress" == x && !_) || ("option" == x && _ != b[a])) &&
          j(u, a, _, b[a], o),
      (a = "checked"),
      null != m && m != u[a] && j(u, a, m, b[a], o));
  }
  return u;
}
function B(n, u, t) {
  try {
    if ("function" == typeof n) {
      var i = "function" == typeof n.__u;
      (i && n.__u(), (i && null == u) || (n.__u = n(u)));
    } else n.current = u;
  } catch (n) {
    l.__e(n, t);
  }
}
function D(n, u, t) {
  var i, r;
  if (
    (l.unmount && l.unmount(n),
    (i = n.ref) && ((i.current && i.current != n.__e) || B(i, null, u)),
    null != (i = n.__c))
  ) {
    if (i.componentWillUnmount)
      try {
        i.componentWillUnmount();
      } catch (n) {
        l.__e(n, u);
      }
    i.base = i.__P = null;
  }
  if ((i = n.__k))
    for (r = 0; r < i.length; r++) i[r] && D(i[r], u, t || "function" != typeof n.type);
  (t || g(n.__e), (n.__c = n.__ = n.__e = void 0));
}
function E(n, l, u) {
  return this.constructor(n, u);
}
function G(u, t, i) {
  var r, o, e, f;
  (t == document && (t = document.documentElement),
    l.__ && l.__(u, t),
    (o = (r = "function" == typeof i) ? null : (i && i.__k) || t.__k),
    (e = []),
    (f = []),
    O(
      t,
      (u = ((!r && i) || t).__k = _(k, null, [u])),
      o || p,
      p,
      t.namespaceURI,
      !r && i ? [i] : o ? null : t.firstChild ? n.call(t.childNodes) : null,
      e,
      !r && i ? i : o ? o.__e : t.firstChild,
      r,
      f
    ),
    N(e, u, f));
}
function J(n, l) {
  G(n, l, J);
}
function K(l, u, t) {
  var i,
    r,
    o,
    e,
    f = d({}, l.props);
  for (o in (l.type && l.type.defaultProps && (e = l.type.defaultProps), u))
    "key" == o
      ? (i = u[o])
      : "ref" == o
        ? (r = u[o])
        : (f[o] = void 0 === u[o] && null != e ? e[o] : u[o]);
  return (
    arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t),
    m(l.type, f, i || l.key, r || l.ref, null)
  );
}
function Q(n) {
  function l(n) {
    var u, t;
    return (
      this.getChildContext ||
        ((u = new Set()),
        ((t = {})[l.__c] = this),
        (this.getChildContext = function () {
          return t;
        }),
        (this.componentWillUnmount = function () {
          u = null;
        }),
        (this.shouldComponentUpdate = function (n) {
          this.props.value != n.value &&
            u.forEach(function (n) {
              ((n.__e = !0), M(n));
            });
        }),
        (this.sub = function (n) {
          u.add(n);
          var l = n.componentWillUnmount;
          n.componentWillUnmount = function () {
            (u && u.delete(n), l && l.call(n));
          };
        })),
      n.children
    );
  }
  return (
    (l.__c = "__cC" + h++),
    (l.__ = n),
    (l.Provider =
      l.__l =
      (l.Consumer = function (n, l) {
        return n.children(l);
      }).contextType =
        l),
    l
  );
}
((n = v.slice),
  (l = {
    __e: function (n, l, u, t) {
      for (var i, r, o; (l = l.__); )
        if ((i = l.__c) && !i.__)
          try {
            if (
              ((r = i.constructor) &&
                null != r.getDerivedStateFromError &&
                (i.setState(r.getDerivedStateFromError(n)), (o = i.__d)),
              null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), (o = i.__d)),
              o)
            )
              return (i.__E = i);
          } catch (l) {
            n = l;
          }
      throw n;
    },
  }),
  (u = 0),
  (t = function (n) {
    return null != n && null == n.constructor;
  }),
  (x.prototype.setState = function (n, l) {
    var u;
    ((u = null != this.__s && this.__s != this.state ? this.__s : (this.__s = d({}, this.state))),
      "function" == typeof n && (n = n(d({}, u), this.props)),
      n && d(u, n),
      null != n && this.__v && (l && this._sb.push(l), M(this)));
  }),
  (x.prototype.forceUpdate = function (n) {
    this.__v && ((this.__e = !0), n && this.__h.push(n), M(this));
  }),
  (x.prototype.render = k),
  (i = []),
  (o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
  (e = function (n, l) {
    return n.__v.__b - l.__v.__b;
  }),
  ($.__r = 0),
  (f = /(PointerCapture)$|Capture$/i),
  (c = 0),
  (s = F(!1)),
  (a = F(!0)),
  (h = 0));
export {
  x as Component,
  k as Fragment,
  K as cloneElement,
  Q as createContext,
  _ as createElement,
  b as createRef,
  _ as h,
  J as hydrate,
  t as isValidElement,
  l as options,
  G as render,
  H as toChildArray,
};
//# sourceMappingURL=preact.module.js.map

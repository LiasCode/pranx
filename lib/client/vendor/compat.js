import {
  createRef as c,
  options as e,
  cloneElement as f,
  hydrate as i,
  createContext as l,
  Component as n,
  render as o,
  toChildArray as r,
  createElement as t,
  Fragment as u,
} from "preact";
import {
  useMemo as _,
  useState as a,
  useReducer as b,
  useContext as d,
  useEffect as h,
  useDebugValue as m,
  useId as p,
  useLayoutEffect as s,
  useRef as S,
  useCallback as v,
  useImperativeHandle as y,
} from "preact/hooks";
export { Component, createContext, createElement, createRef, Fragment } from "preact";
export * from "preact/hooks";
export {
  hn as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  O as Children,
  _n as cloneElement,
  dn as createFactory,
  $ as createPortal,
  Rn as default,
  Sn as findDOMNode,
  En as flushSync,
  D as forwardRef,
  tn as hydrate,
  xn as isElement,
  pn as isFragment,
  yn as isMemo,
  mn as isValidElement,
  z as lazy,
  M as memo,
  N as PureComponent,
  nn as render,
  R as startTransition,
  Cn as StrictMode,
  P as Suspense,
  B as SuspenseList,
  bn as unmountComponentAtNode,
  gn as unstable_batchedUpdates,
  w as useDeferredValue,
  I as useInsertionEffect,
  C as useSyncExternalStore,
  k as useTransition,
  vn as version,
};
function g(n, t) {
  for (const e in t) n[e] = t[e];
  return n;
}
function E(n, t) {
  for (const e in n) if ("__source" !== e && !(e in t)) return !0;
  for (const r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
  return !1;
}
function C(n, t) {
  const e = t();
  const r = a({ t: { __: e, u: t } });
  const u = r[0].t;
  const o = r[1];
  return (
    s(() => {
      (u.__ = e), (u.u = t), x(u) && o({ t: u });
    }, [n, e, t]),
    h(
      () => (
        x(u) && o({ t: u }),
        n(() => {
          x(u) && o({ t: u });
        })
      ),
      [n]
    ),
    e
  );
}
function x(n) {
  let t;
  let e;
  const r = n.u;
  const u = n.__;
  try {
    const o = r();
    return !(((t = u) === (e = o) && (0 !== t || 1 / t === 1 / e)) || (t !== t && e !== e));
  } catch (n) {
    return !0;
  }
}
function R(n) {
  n();
}
function w(n) {
  return n;
}
function k() {
  return [!1, R];
}
const I = s;
function N(n, t) {
  (this.props = n), (this.context = t);
}
function M(n, e) {
  function r(n) {
    const t = this.props.ref;
    const r = t === n.ref;
    return !r && t && (t.call ? t(null) : (t.current = null)), e ? !e(this.props, n) || !r : E(this.props, n);
  }
  function u(e) {
    return (this.shouldComponentUpdate = r), t(n, e);
  }
  return (u.displayName = `Memo(${n.displayName || n.name})`), (u.prototype.isReactComponent = !0), (u.__f = !0), u;
}
((N.prototype = new n()).isPureReactComponent = !0),
  (N.prototype.shouldComponentUpdate = function (n, t) {
    return E(this.props, n) || E(this.state, t);
  });
const T = e.__b;
e.__b = (n) => {
  n.type?.__f && n.ref && ((n.props.ref = n.ref), (n.ref = null)), T?.(n);
};
const A = ("undefined" !== typeof Symbol && Symbol.for && Symbol.for("react.forward_ref")) || 3911;
function D(n) {
  function t(t) {
    const e = g({}, t);
    return (e.ref = undefined), n(e, t.ref || null);
  }
  return (
    (t.$$typeof = A),
    (t.render = t),
    (t.prototype.isReactComponent = t.__f = !0),
    (t.displayName = `ForwardRef(${n.displayName || n.name})`),
    t
  );
}
const L = (n, t) => (null == n ? null : r(r(n).map(t)));
const O = {
  map: L,
  forEach: L,
  count: (n) => (n ? r(n).length : 0),
  only: (n) => {
    const t = r(n);
    if (1 !== t.length) throw "Children.only";
    return t[0];
  },
  toArray: r,
};
const F = e.__e;
e.__e = (n, t, e, r) => {
  if (n.then)
    for (let u, o = t; (o = o.__); )
      if ((u = o.__c) && u.__c) return null == t.__e && ((t.__e = e.__e), (t.__k = e.__k)), u.__c(n, t);
  F(n, t, e, r);
};
const U = e.unmount;
function V(n, t, e) {
  return (
    n &&
      (n.__c?.__H &&
        (n.__c.__H.__.forEach((n) => {
          "function" === typeof n.__c && n.__c();
        }),
        (n.__c.__H = null)),
      null != (n = g({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), (n.__c.__e = !0), (n.__c = null)),
      (n.__k = n.__k?.map((n) => V(n, t, e)))),
    n
  );
}
function W(n, t, e) {
  return (
    n &&
      e &&
      ((n.__v = null),
      (n.__k = n.__k?.map((n) => W(n, t, e))),
      n.__c && n.__c.__P === t && (n.__e && e.appendChild(n.__e), (n.__c.__e = !0), (n.__c.__P = e))),
    n
  );
}
function P() {
  (this.__u = 0), (this.o = null), (this.__b = null);
}
function j(n) {
  const t = n.__.__c;
  return t?.__a?.(n);
}
function z(n) {
  let e;
  let r;
  let u;
  function o(o) {
    if (
      (e ||
        (e = n()).then(
          (n) => {
            r = n.default || n;
          },
          (n) => {
            u = n;
          }
        ),
      u)
    )
      throw u;
    if (!r) throw e;
    return t(r, o);
  }
  return (o.displayName = "Lazy"), (o.__f = !0), o;
}
function B() {
  (this.i = null), (this.l = null);
}
(e.unmount = (n) => {
  const t = n.__c;
  t?.__R?.(), t && 32 & n.__u && (n.type = null), U?.(n);
}),
  ((P.prototype = new n()).__c = function (n, t) {
    const e = t.__c;
    null == this.o && (this.o = []), this.o.push(e);
    const u = j(this.__v);
    let o = !1;
    const i = () => {
      o || ((o = !0), (e.__R = null), u ? u(l) : l());
    };
    e.__R = i;
    const l = () => {
      if (!--this.__u) {
        if (this.state.__a) {
          const n = this.state.__a;
          this.__v.__k[0] = W(n, n.__c.__P, n.__c.__O);
        }
        let t;
        for (this.setState({ __a: (this.__b = null) }); (t = this.o.pop()); ) t.forceUpdate();
      }
    };
    this.__u++ || 32 & t.__u || this.setState({ __a: (this.__b = this.__v.__k[0]) }), n.then(i, i);
  }),
  (P.prototype.componentWillUnmount = function () {
    this.o = [];
  }),
  (P.prototype.render = function (n, e) {
    if (this.__b) {
      if (this.__v.__k) {
        const r = document.createElement("div");
        const o = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r, (o.__O = o.__P));
      }
      this.__b = null;
    }
    const i = e.__a && t(u, null, n.fallback);
    return i && (i.__u &= -33), [t(u, null, e.__a ? null : n.children), i];
  });
const H = (n, t, e) => {
  if ((++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)))
    for (e = n.i; e; ) {
      while (e.length > 3) e.pop()();
      if (e[1] < e[0]) break;
      n.i = e = e[2];
    }
};
function Z(n) {
  return (this.getChildContext = () => n.context), n.children;
}
function Y(n) {
  const e = this;
  const r = n.h;
  if (
    ((e.componentWillUnmount = () => {
      o(null, e.v), (e.v = null), (e.h = null);
    }),
    e.h && e.h !== r && e.componentWillUnmount(),
    !e.v)
  ) {
    for (let u = e.__v; null !== u && !u.__m && null !== u.__; ) u = u.__;
    (e.h = r),
      (e.v = {
        nodeType: 1,
        parentNode: r,
        childNodes: [],
        __k: { __m: u.__m },
        contains: () => !0,
        insertBefore: function (n, t) {
          this.childNodes.push(n), e.h.insertBefore(n, t);
        },
        removeChild: function (n) {
          this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.h.removeChild(n);
        },
      });
  }
  o(t(Z, { context: e.context }, n.__v), e.v);
}
function $(n, e) {
  const r = t(Y, { __v: n, h: e });
  return (r.containerInfo = e), r;
}
((B.prototype = new n()).__a = function (n) {
  const e = j(this.__v);
  const r = this.l.get(n);
  return (
    r[0]++,
    (u) => {
      const o = () => {
        this.props.revealOrder ? (r.push(u), H(this, n, r)) : u();
      };
      e ? e(o) : o();
    }
  );
}),
  (B.prototype.render = function (n) {
    (this.i = null), (this.l = new Map());
    const t = r(n.children);
    n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
    for (let e = t.length; e--; ) this.l.set(t[e], (this.i = [1, 0, this.i]));
    return n.children;
  }),
  (B.prototype.componentDidUpdate = B.prototype.componentDidMount =
    function () {
      this.l.forEach((t, e) => {
        H(this, e, t);
      });
    });
const q = ("undefined" !== typeof Symbol && Symbol.for && Symbol.for("react.element")) || 60103;
const G =
  /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
const J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
const K = /[A-Z0-9]/g;
const Q = "undefined" !== typeof document;
const X = (n) => ("undefined" !== typeof Symbol && "symbol" === typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
function nn(n, t, e) {
  return null == t.__k && (t.textContent = ""), o(n, t), "function" === typeof e && e(), n ? n.__c : null;
}
function tn(n, t, e) {
  return i(n, t), "function" === typeof e && e(), n ? n.__c : null;
}
(n.prototype.isReactComponent = {}),
  ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach((t) => {
    Object.defineProperty(n.prototype, t, {
      configurable: !0,
      get: function () {
        return this[`UNSAFE_${t}`];
      },
      set: function (n) {
        Object.defineProperty(this, t, { configurable: !0, writable: !0, value: n });
      },
    });
  });
const en = e.event;
function rn() {}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
e.event = (n) => (
  en && (n = en(n)), (n.persist = rn), (n.isPropagationStopped = un), (n.isDefaultPrevented = on), (n.nativeEvent = n)
);
let ln;
const cn = {
  enumerable: !1,
  configurable: !0,
  get: function () {
    return this.class;
  },
};
const fn = e.vnode;
e.vnode = (n) => {
  "string" === typeof n.type &&
    ((n) => {
      const t = n.props;
      const e = n.type;
      const u = {};
      const o = -1 === e.indexOf("-");
      for (let i in t) {
        let l = t[i];
        if (
          !(
            ("value" === i && "defaultValue" in t && null == l) ||
            (Q && "children" === i && "noscript" === e) ||
            "class" === i ||
            "className" === i
          )
        ) {
          let c = i.toLowerCase();
          "defaultValue" === i && "value" in t && null == t.value
            ? (i = "value")
            : "download" === i && !0 === l
              ? (l = "")
              : "translate" === c && "no" === l
                ? (l = !1)
                : "o" === c[0] && "n" === c[1]
                  ? "ondoubleclick" === c
                    ? (i = "ondblclick")
                    : "onchange" !== c || ("input" !== e && "textarea" !== e) || X(t.type)
                      ? "onfocus" === c
                        ? (i = "onfocusin")
                        : "onblur" === c
                          ? (i = "onfocusout")
                          : J.test(i) && (i = c)
                      : (c = i = "oninput")
                  : o && G.test(i)
                    ? (i = i.replace(K, "-$&").toLowerCase())
                    : null === l && (l = void 0),
            "oninput" === c && u[(i = c)] && (i = "oninputCapture"),
            (u[i] = l);
        }
      }
      "select" === e &&
        u.multiple &&
        Array.isArray(u.value) &&
        (u.value = r(t.children).forEach((n) => {
          n.props.selected = -1 !== u.value.indexOf(n.props.value);
        })),
        "select" === e &&
          null != u.defaultValue &&
          (u.value = r(t.children).forEach((n) => {
            n.props.selected = u.multiple
              ? -1 !== u.defaultValue.indexOf(n.props.value)
              : u.defaultValue === n.props.value;
          })),
        t.class && !t.className
          ? ((u.class = t.class), Object.defineProperty(u, "className", cn))
          : ((t.className && !t.class) || (t.class && t.className)) && (u.class = u.className = t.className),
        (n.props = u);
    })(n),
    (n.$$typeof = q),
    fn?.(n);
};
const an = e.__r;
e.__r = (n) => {
  an?.(n), (ln = n.__c);
};
const sn = e.diffed;
e.diffed = (n) => {
  sn?.(n);
  const t = n.props;
  const e = n.__e;
  null != e &&
    "textarea" === n.type &&
    "value" in t &&
    t.value !== e.value &&
    (e.value = null == t.value ? "" : t.value),
    (ln = null);
};
const hn = {
  ReactCurrentDispatcher: {
    current: {
      readContext: (n) => ln.__n[n.__c].props.value,
      useCallback: v,
      useContext: d,
      useDebugValue: m,
      useDeferredValue: w,
      useEffect: h,
      useId: p,
      useImperativeHandle: y,
      useInsertionEffect: I,
      useLayoutEffect: s,
      useMemo: _,
      useReducer: b,
      useRef: S,
      useState: a,
      useSyncExternalStore: C,
      useTransition: k,
    },
  },
};
const vn = "18.3.1";
function dn(n) {
  return t.bind(null, n);
}
function mn(n) {
  return !!n && n.$$typeof === q;
}
function pn(n) {
  return mn(n) && n.type === u;
}
function yn(n) {
  return (
    !!n &&
    !!n.displayName &&
    ("string" === typeof n.displayName || n.displayName instanceof String) &&
    n.displayName.startsWith("Memo(")
  );
}
function _n(n) {
  return mn(n) ? f.apply(null, arguments) : n;
}
function bn(n) {
  return !!n.__k && (o(null, n), !0);
}
function Sn(n) {
  return (n && (n.base || (1 === n.nodeType && n))) || null;
}
const gn = (n, t) => n(t);
const En = (n, t) => n(t);
const Cn = u;
const xn = mn;
const Rn = {
  useState: a,
  useId: p,
  useReducer: b,
  useEffect: h,
  useLayoutEffect: s,
  useInsertionEffect: I,
  useTransition: k,
  useDeferredValue: w,
  useSyncExternalStore: C,
  startTransition: R,
  useRef: S,
  useImperativeHandle: y,
  useMemo: _,
  useCallback: v,
  useContext: d,
  useDebugValue: m,
  version: "18.3.1",
  Children: O,
  render: nn,
  hydrate: tn,
  unmountComponentAtNode: bn,
  createPortal: $,
  createElement: t,
  createContext: l,
  createFactory: dn,
  cloneElement: _n,
  createRef: c,
  Fragment: u,
  isValidElement: mn,
  isElement: xn,
  isFragment: pn,
  isMemo: yn,
  findDOMNode: Sn,
  Component: n,
  PureComponent: N,
  memo: M,
  forwardRef: D,
  flushSync: En,
  unstable_batchedUpdates: gn,
  StrictMode: Cn,
  Suspense: P,
  SuspenseList: B,
  lazy: z,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: hn,
}; //# sourceMappingURL=compat.module.js.map

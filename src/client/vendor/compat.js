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
  for (var e in t) n[e] = t[e];
  return n;
}
function E(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;
  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
  return !1;
}
function C(n, t) {
  var e = t(),
    r = a({ t: { __: e, u: t } }),
    u = r[0].t,
    o = r[1];
  return (
    s(
      function () {
        ((u.__ = e), (u.u = t), x(u) && o({ t: u }));
      },
      [n, e, t]
    ),
    h(
      function () {
        return (
          x(u) && o({ t: u }),
          n(function () {
            x(u) && o({ t: u });
          })
        );
      },
      [n]
    ),
    e
  );
}
function x(n) {
  var t,
    e,
    r = n.u,
    u = n.__;
  try {
    var o = r();
    return !(((t = u) === (e = o) && (0 !== t || 1 / t == 1 / e)) || (t != t && e != e));
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
var I = s;
function N(n, t) {
  ((this.props = n), (this.context = t));
}
function M(n, e) {
  function r(n) {
    var t = this.props.ref,
      r = t == n.ref;
    return (
      !r && t && (t.call ? t(null) : (t.current = null)),
      e ? !e(this.props, n) || !r : E(this.props, n)
    );
  }
  function u(e) {
    return ((this.shouldComponentUpdate = r), t(n, e));
  }
  return (
    (u.displayName = "Memo(" + (n.displayName || n.name) + ")"),
    (u.prototype.isReactComponent = !0),
    (u.__f = !0),
    u
  );
}
(((N.prototype = new n()).isPureReactComponent = !0),
  (N.prototype.shouldComponentUpdate = function (n, t) {
    return E(this.props, n) || E(this.state, t);
  }));
var T = e.__b;
e.__b = function (n) {
  (n.type && n.type.__f && n.ref && ((n.props.ref = n.ref), (n.ref = null)), T && T(n));
};
var A = ("undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref")) || 3911;
function D(n) {
  function t(t) {
    var e = g({}, t);
    return (delete e.ref, n(e, t.ref || null));
  }
  return (
    (t.$$typeof = A),
    (t.render = t),
    (t.prototype.isReactComponent = t.__f = !0),
    (t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")"),
    t
  );
}
var L = function (n, t) {
    return null == n ? null : r(r(n).map(t));
  },
  O = {
    map: L,
    forEach: L,
    count: function (n) {
      return n ? r(n).length : 0;
    },
    only: function (n) {
      var t = r(n);
      if (1 !== t.length) throw "Children.only";
      return t[0];
    },
    toArray: r,
  },
  F = e.__e;
e.__e = function (n, t, e, r) {
  if (n.then)
    for (var u, o = t; (o = o.__); )
      if ((u = o.__c) && u.__c)
        return (null == t.__e && ((t.__e = e.__e), (t.__k = e.__k)), u.__c(n, t));
  F(n, t, e, r);
};
var U = e.unmount;
function V(n, t, e) {
  return (
    n &&
      (n.__c &&
        n.__c.__H &&
        (n.__c.__H.__.forEach(function (n) {
          "function" == typeof n.__c && n.__c();
        }),
        (n.__c.__H = null)),
      null != (n = g({}, n)).__c &&
        (n.__c.__P === e && (n.__c.__P = t), (n.__c.__e = !0), (n.__c = null)),
      (n.__k =
        n.__k &&
        n.__k.map(function (n) {
          return V(n, t, e);
        }))),
    n
  );
}
function W(n, t, e) {
  return (
    n &&
      e &&
      ((n.__v = null),
      (n.__k =
        n.__k &&
        n.__k.map(function (n) {
          return W(n, t, e);
        })),
      n.__c &&
        n.__c.__P === t &&
        (n.__e && e.appendChild(n.__e), (n.__c.__e = !0), (n.__c.__P = e))),
    n
  );
}
function P() {
  ((this.__u = 0), (this.o = null), (this.__b = null));
}
function j(n) {
  var t = n.__.__c;
  return t && t.__a && t.__a(n);
}
function z(n) {
  var e, r, u;
  function o(o) {
    if (
      (e ||
        (e = n()).then(
          function (n) {
            r = n.default || n;
          },
          function (n) {
            u = n;
          }
        ),
      u)
    )
      throw u;
    if (!r) throw e;
    return t(r, o);
  }
  return ((o.displayName = "Lazy"), (o.__f = !0), o);
}
function B() {
  ((this.i = null), (this.l = null));
}
((e.unmount = function (n) {
  var t = n.__c;
  (t && t.__R && t.__R(), t && 32 & n.__u && (n.type = null), U && U(n));
}),
  ((P.prototype = new n()).__c = function (n, t) {
    var e = t.__c,
      r = this;
    (null == r.o && (r.o = []), r.o.push(e));
    var u = j(r.__v),
      o = !1,
      i = function () {
        o || ((o = !0), (e.__R = null), u ? u(l) : l());
      };
    e.__R = i;
    var l = function () {
      if (!--r.__u) {
        if (r.state.__a) {
          var n = r.state.__a;
          r.__v.__k[0] = W(n, n.__c.__P, n.__c.__O);
        }
        var t;
        for (r.setState({ __a: (r.__b = null) }); (t = r.o.pop()); ) t.forceUpdate();
      }
    };
    (r.__u++ || 32 & t.__u || r.setState({ __a: (r.__b = r.__v.__k[0]) }), n.then(i, i));
  }),
  (P.prototype.componentWillUnmount = function () {
    this.o = [];
  }),
  (P.prototype.render = function (n, e) {
    if (this.__b) {
      if (this.__v.__k) {
        var r = document.createElement("div"),
          o = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r, (o.__O = o.__P));
      }
      this.__b = null;
    }
    var i = e.__a && t(u, null, n.fallback);
    return (i && (i.__u &= -33), [t(u, null, e.__a ? null : n.children), i]);
  }));
var H = function (n, t, e) {
  if (
    (++e[1] === e[0] && n.l.delete(t),
    n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size))
  )
    for (e = n.i; e; ) {
      for (; e.length > 3; ) e.pop()();
      if (e[1] < e[0]) break;
      n.i = e = e[2];
    }
};
function Z(n) {
  return (
    (this.getChildContext = function () {
      return n.context;
    }),
    n.children
  );
}
function Y(n) {
  var e = this,
    r = n.h;
  if (
    ((e.componentWillUnmount = function () {
      (o(null, e.v), (e.v = null), (e.h = null));
    }),
    e.h && e.h !== r && e.componentWillUnmount(),
    !e.v)
  ) {
    for (var u = e.__v; null !== u && !u.__m && null !== u.__; ) u = u.__;
    ((e.h = r),
      (e.v = {
        nodeType: 1,
        parentNode: r,
        childNodes: [],
        __k: { __m: u.__m },
        contains: function () {
          return !0;
        },
        insertBefore: function (n, t) {
          (this.childNodes.push(n), e.h.insertBefore(n, t));
        },
        removeChild: function (n) {
          (this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.h.removeChild(n));
        },
      }));
  }
  o(t(Z, { context: e.context }, n.__v), e.v);
}
function $(n, e) {
  var r = t(Y, { __v: n, h: e });
  return ((r.containerInfo = e), r);
}
(((B.prototype = new n()).__a = function (n) {
  var t = this,
    e = j(t.__v),
    r = t.l.get(n);
  return (
    r[0]++,
    function (u) {
      var o = function () {
        t.props.revealOrder ? (r.push(u), H(t, n, r)) : u();
      };
      e ? e(o) : o();
    }
  );
}),
  (B.prototype.render = function (n) {
    ((this.i = null), (this.l = new Map()));
    var t = r(n.children);
    n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
    for (var e = t.length; e--; ) this.l.set(t[e], (this.i = [1, 0, this.i]));
    return n.children;
  }),
  (B.prototype.componentDidUpdate = B.prototype.componentDidMount =
    function () {
      var n = this;
      this.l.forEach(function (t, e) {
        H(n, e, t);
      });
    }));
var q = ("undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element")) || 60103,
  G =
    /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
  J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/,
  K = /[A-Z0-9]/g,
  Q = "undefined" != typeof document,
  X = function (n) {
    return (
      "undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/
    ).test(n);
  };
function nn(n, t, e) {
  return (
    null == t.__k && (t.textContent = ""),
    o(n, t),
    "function" == typeof e && e(),
    n ? n.__c : null
  );
}
function tn(n, t, e) {
  return (i(n, t), "function" == typeof e && e(), n ? n.__c : null);
}
((n.prototype.isReactComponent = {}),
  ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function (t) {
    Object.defineProperty(n.prototype, t, {
      configurable: !0,
      get: function () {
        return this["UNSAFE_" + t];
      },
      set: function (n) {
        Object.defineProperty(this, t, { configurable: !0, writable: !0, value: n });
      },
    });
  }));
var en = e.event;
function rn() {}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
e.event = function (n) {
  return (
    en && (n = en(n)),
    (n.persist = rn),
    (n.isPropagationStopped = un),
    (n.isDefaultPrevented = on),
    (n.nativeEvent = n)
  );
};
var ln,
  cn = {
    enumerable: !1,
    configurable: !0,
    get: function () {
      return this.class;
    },
  },
  fn = e.vnode;
e.vnode = function (n) {
  ("string" == typeof n.type &&
    (function (n) {
      var t = n.props,
        e = n.type,
        u = {},
        o = -1 === e.indexOf("-");
      for (var i in t) {
        var l = t[i];
        if (
          !(
            ("value" === i && "defaultValue" in t && null == l) ||
            (Q && "children" === i && "noscript" === e) ||
            "class" === i ||
            "className" === i
          )
        ) {
          var c = i.toLowerCase();
          ("defaultValue" === i && "value" in t && null == t.value
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
            (u[i] = l));
        }
      }
      ("select" == e &&
        u.multiple &&
        Array.isArray(u.value) &&
        (u.value = r(t.children).forEach(function (n) {
          n.props.selected = -1 != u.value.indexOf(n.props.value);
        })),
        "select" == e &&
          null != u.defaultValue &&
          (u.value = r(t.children).forEach(function (n) {
            n.props.selected = u.multiple
              ? -1 != u.defaultValue.indexOf(n.props.value)
              : u.defaultValue == n.props.value;
          })),
        t.class && !t.className
          ? ((u.class = t.class), Object.defineProperty(u, "className", cn))
          : ((t.className && !t.class) || (t.class && t.className)) &&
            (u.class = u.className = t.className),
        (n.props = u));
    })(n),
    (n.$$typeof = q),
    fn && fn(n));
};
var an = e.__r;
e.__r = function (n) {
  (an && an(n), (ln = n.__c));
};
var sn = e.diffed;
e.diffed = function (n) {
  sn && sn(n);
  var t = n.props,
    e = n.__e;
  (null != e &&
    "textarea" === n.type &&
    "value" in t &&
    t.value !== e.value &&
    (e.value = null == t.value ? "" : t.value),
    (ln = null));
};
var hn = {
    ReactCurrentDispatcher: {
      current: {
        readContext: function (n) {
          return ln.__n[n.__c].props.value;
        },
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
  },
  vn = "18.3.1";
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
    ("string" == typeof n.displayName || n.displayName instanceof String) &&
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
var gn = function (n, t) {
    return n(t);
  },
  En = function (n, t) {
    return n(t);
  },
  Cn = u,
  xn = mn,
  Rn = {
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

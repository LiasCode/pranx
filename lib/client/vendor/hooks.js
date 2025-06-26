import { options as n } from "preact";
let t;
let r;
let u;
let i;
let o = 0;
const f = [];
const c = n;
const e = c.__b;
const a = c.__r;
const v = c.diffed;
const l = c.__c;
const m = c.unmount;
const s = c.__;
function p(n, t) {
  (c.__h?.(r, n, o || t), (o = 0));
  const u = r.__H || (r.__H = { __: [], __h: [] });
  return (n >= u.__.length && u.__.push({}), u.__[n]);
}
function d(n) {
  return ((o = 1), h(D, n));
}
function h(n, u, i) {
  const o = p(t++, 2);
  if (
    ((o.t = n),
    !o.__c &&
      ((o.__ = [
        i ? i(u) : D(void 0, u),
        (n) => {
          const t = o.__N ? o.__N[0] : o.__[0];
          const r = o.t(t, n);
          t !== r && ((o.__N = [r, o.__[1]]), o.__c.setState({}));
        },
      ]),
      (o.__c = r),
      !r.__f))
  ) {
    const f = function (n, t, r) {
      if (!o.__c.__H) return !0;
      const u = o.__c.__H.__.filter((n) => !!n.__c);
      if (u.every((n) => !n.__N)) return !c || c.call(this, n, t, r);
      let i = o.__c.props !== n;
      return (
        u.forEach((n) => {
          if (n.__N) {
            const t = n.__[0];
            ((n.__ = n.__N), (n.__N = void 0), t !== n.__[0] && (i = !0));
          }
        }),
        c?.call(this, n, t, r) || i
      );
    };
    r.__f = !0;
    let c = r.shouldComponentUpdate;
    const e = r.componentWillUpdate;
    ((r.componentWillUpdate = function (n, t, r) {
      if (this.__e) {
        const u = c;
        ((c = void 0), f(n, t, r), (c = u));
      }
      e?.call(this, n, t, r);
    }),
      (r.shouldComponentUpdate = f));
  }
  return o.__N || o.__;
}
function y(n, u) {
  const i = p(t++, 3);
  !c.__s && C(i.__H, u) && ((i.__ = n), (i.u = u), r.__H.__h.push(i));
}
function _(n, u) {
  const i = p(t++, 4);
  !c.__s && C(i.__H, u) && ((i.__ = n), (i.u = u), r.__h.push(i));
}
function A(n) {
  return ((o = 5), T(() => ({ current: n }), []));
}
function F(n, t, r) {
  ((o = 6),
    _(
      () => {
        if ("function" === typeof n) {
          const r = n(t());
          return () => {
            (n(null), r && "function" === typeof r && r());
          };
        }
        if (n) return ((n.current = t()), () => (n.current = null));
      },
      null == r ? r : r.concat(n)
    ));
}
function T(n, r) {
  const u = p(t++, 7);
  return (C(u.__H, r) && ((u.__ = n()), (u.__H = r), (u.__h = n)), u.__);
}
function q(n, t) {
  return ((o = 8), T(() => n, t));
}
function x(n) {
  const u = r.context[n.__c];
  const i = p(t++, 9);
  return ((i.c = n), u ? (null == i.__ && ((i.__ = !0), u.sub(r)), u.props.value) : n.__);
}
function P(n, t) {
  c.useDebugValue?.(t ? t(n) : n);
}
function b(n) {
  const u = p(t++, 10);
  const i = d();
  return (
    (u.__ = n),
    r.componentDidCatch ||
      (r.componentDidCatch = (n, t) => {
        (u.__?.(n, t), i[1](n));
      }),
    [
      i[0],
      () => {
        i[1](void 0);
      },
    ]
  );
}
function g() {
  const n = p(t++, 11);
  if (!n.__) {
    for (let u = r.__v; null !== u && !u.__m && null !== u.__; ) u = u.__;
    const i = u.__m || (u.__m = [0, 0]);
    n.__ = `P${i[0]}-${i[1]++}`;
  }
  return n.__;
}
function j() {
  for (let n; (n = f.shift()); )
    if (n.__P && n.__H)
      try {
        (n.__H.__h.forEach(z), n.__H.__h.forEach(B), (n.__H.__h = []));
      } catch (t) {
        ((n.__H.__h = []), c.__e(t, n.__v));
      }
}
((c.__b = (n) => {
  ((r = null), e?.(n));
}),
  (c.__ = (n, t) => {
    (n && t.__k && t.__k.__m && (n.__m = t.__k.__m), s?.(n, t));
  }),
  (c.__r = (n) => {
    (a?.(n), (t = 0));
    const i = (r = n.__c).__H;
    (i &&
      (u === r
        ? ((i.__h = []),
          (r.__h = []),
          i.__.forEach((n) => {
            (n.__N && (n.__ = n.__N), (n.u = n.__N = void 0));
          }))
        : (i.__h.forEach(z), i.__h.forEach(B), (i.__h = []), (t = 0))),
      (u = r));
  }),
  (c.diffed = (n) => {
    v?.(n);
    const t = n.__c;
    (t?.__H &&
      (t.__H.__h.length &&
        ((1 !== f.push(t) && i === c.requestAnimationFrame) || ((i = c.requestAnimationFrame) || w)(j)),
      t.__H.__.forEach((n) => {
        (n.u && (n.__H = n.u), (n.u = void 0));
      })),
      (u = r = null));
  }),
  (c.__c = (n, t) => {
    (t.some((n) => {
      try {
        (n.__h.forEach(z), (n.__h = n.__h.filter((n) => !n.__ || B(n))));
      } catch (r) {
        (t.some((n) => {
          n.__h && (n.__h = []);
        }),
          (t = []),
          c.__e(r, n.__v));
      }
    }),
      l?.(n, t));
  }),
  (c.unmount = (n) => {
    m?.(n);
    let t;
    const r = n.__c;
    r?.__H &&
      (r.__H.__.forEach((n) => {
        try {
          z(n);
        } catch (n) {
          t = n;
        }
      }),
      (r.__H = void 0),
      t && c.__e(t, r.__v));
  }));
const k = "function" === typeof requestAnimationFrame;
function w(n) {
  let t;
  const r = () => {
    (clearTimeout(u), k && cancelAnimationFrame(t), setTimeout(n));
  };
  const u = setTimeout(r, 35);
  k && (t = requestAnimationFrame(r));
}
function z(n) {
  const t = r;
  const u = n.__c;
  ("function" === typeof u && ((n.__c = void 0), u()), (r = t));
}
function B(n) {
  const t = r;
  ((n.__c = n.__()), (r = t));
}
function C(n, t) {
  return !n || n.length !== t.length || t.some((t, r) => t !== n[r]);
}
function D(n, t) {
  return "function" === typeof t ? t(n) : t;
}
export {
  q as useCallback,
  x as useContext,
  P as useDebugValue,
  y as useEffect,
  b as useErrorBoundary,
  g as useId,
  F as useImperativeHandle,
  _ as useLayoutEffect,
  T as useMemo,
  h as useReducer,
  A as useRef,
  d as useState,
};
//# sourceMappingURL=hooks.module.js.map

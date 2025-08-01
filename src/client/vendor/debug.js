import { options as e, Fragment as n, Component as o } from "preact";
import "preact/devtools";
var t = {};
function r() {
  t = {};
}
function a(e) {
  return e.type === n
    ? "Fragment"
    : "function" == typeof e.type
      ? e.type.displayName || e.type.name
      : "string" == typeof e.type
        ? e.type
        : "#text";
}
var i = [],
  s = [];
function c() {
  return i.length > 0 ? i[i.length - 1] : null;
}
var l = !0;
function u(e) {
  return "function" == typeof e.type && e.type != n;
}
function f(n) {
  for (var e = [n], o = n; null != o.__o; ) (e.push(o.__o), (o = o.__o));
  return e.reduce(function (n, e) {
    n += "  in " + a(e);
    var o = e.__source;
    return (
      o
        ? (n += " (at " + o.fileName + ":" + o.lineNumber + ")")
        : l &&
          console.warn(
            "Add @babel/plugin-transform-react-jsx-source to get a more detailed component stack. Note that you should not add it to production builds of your App for bundle size reasons."
          ),
      (l = !1),
      n + "\n"
    );
  }, "");
}
var d = "function" == typeof WeakMap;
function p(n) {
  var e = [];
  return n.__k
    ? (n.__k.forEach(function (n) {
        n && "function" == typeof n.type
          ? e.push.apply(e, p(n))
          : n && "string" == typeof n.type && e.push(n.type);
      }),
      e)
    : e;
}
function h(n) {
  return n
    ? "function" == typeof n.type
      ? null == n.__
        ? null != n.__e && null != n.__e.parentNode
          ? n.__e.parentNode.localName
          : ""
        : h(n.__)
      : n.type
    : "";
}
var v = o.prototype.setState;
function y(n) {
  return (
    "table" === n ||
    "tfoot" === n ||
    "tbody" === n ||
    "thead" === n ||
    "td" === n ||
    "tr" === n ||
    "th" === n
  );
}
o.prototype.setState = function (n, e) {
  return (
    null == this.__v &&
      null == this.state &&
      console.warn(
        'Calling "this.setState" inside the constructor of a component is a no-op and might be a bug in your application. Instead, set "this.state = {}" directly.\n\n' +
          f(c())
      ),
    v.call(this, n, e)
  );
};
var m =
    /^(address|article|aside|blockquote|details|div|dl|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|main|menu|nav|ol|p|pre|search|section|table|ul)$/,
  b = o.prototype.forceUpdate;
function w(n) {
  var e = n.props,
    o = a(n),
    t = "";
  for (var r in e)
    if (e.hasOwnProperty(r) && "children" !== r) {
      var i = e[r];
      ("function" == typeof i && (i = "function " + (i.displayName || i.name) + "() {}"),
        (i = Object(i) !== i || i.toString ? i + "" : Object.prototype.toString.call(i)),
        (t += " " + r + "=" + JSON.stringify(i)));
    }
  var s = e.children;
  return "<" + o + t + (s && s.length ? ">..</" + o + ">" : " />");
}
((o.prototype.forceUpdate = function (n) {
  return (
    null == this.__v
      ? console.warn(
          'Calling "this.forceUpdate" inside the constructor of a component is a no-op and might be a bug in your application.\n\n' +
            f(c())
        )
      : null == this.__P &&
        console.warn(
          'Can\'t call "this.forceUpdate" on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.\n\n' +
            f(this.__v)
        ),
    b.call(this, n)
  );
}),
  (e.__m = function (n, e) {
    var o = n.type,
      t = e
        .map(function (n) {
          return n && n.localName;
        })
        .filter(Boolean);
    console.error(
      'Expected a DOM node of type "' +
        o +
        '" but found "' +
        t.join(", ") +
        "\" as available DOM-node(s), this is caused by the SSR'd HTML containing different DOM-nodes compared to the hydrated one.\n\n" +
        f(n)
    );
  }),
  (function () {
    !(function () {
      var n = e.__b,
        o = e.diffed,
        t = e.__,
        r = e.vnode,
        a = e.__r;
      ((e.diffed = function (n) {
        (u(n) && s.pop(), i.pop(), o && o(n));
      }),
        (e.__b = function (e) {
          (u(e) && i.push(e), n && n(e));
        }),
        (e.__ = function (n, e) {
          ((s = []), t && t(n, e));
        }),
        (e.vnode = function (n) {
          ((n.__o = s.length > 0 ? s[s.length - 1] : null), r && r(n));
        }),
        (e.__r = function (n) {
          (u(n) && s.push(n), a && a(n));
        }));
    })();
    var n = !1,
      o = e.__b,
      r = e.diffed,
      c = e.vnode,
      l = e.__r,
      v = e.__e,
      b = e.__,
      g = e.__h,
      E = d
        ? { useEffect: new WeakMap(), useLayoutEffect: new WeakMap(), lazyPropTypes: new WeakMap() }
        : null,
      k = [];
    ((e.__e = function (n, e, o, t) {
      if (e && e.__c && "function" == typeof n.then) {
        var r = n;
        n = new Error("Missing Suspense. The throwing component was: " + a(e));
        for (var i = e; i; i = i.__)
          if (i.__c && i.__c.__c) {
            n = r;
            break;
          }
        if (n instanceof Error) throw n;
      }
      try {
        (((t = t || {}).componentStack = f(e)),
          v(n, e, o, t),
          "function" != typeof n.then &&
            setTimeout(function () {
              throw n;
            }));
      } catch (n) {
        throw n;
      }
    }),
      (e.__ = function (n, e) {
        if (!e)
          throw new Error(
            "Undefined parent passed to render(), this is the second argument.\nCheck if the element is available in the DOM/has the correct id."
          );
        var o;
        switch (e.nodeType) {
          case 1:
          case 11:
          case 9:
            o = !0;
            break;
          default:
            o = !1;
        }
        if (!o) {
          var t = a(n);
          throw new Error(
            "Expected a valid HTML node as a second argument to render.\tReceived " +
              e +
              " instead: render(<" +
              t +
              " />, " +
              e +
              ");"
          );
        }
        b && b(n, e);
      }),
      (e.__b = function (e) {
        var r = e.type;
        if (((n = !0), void 0 === r))
          throw new Error(
            "Undefined component passed to createElement()\n\nYou likely forgot to export your component or might have mixed up default and named imports" +
              w(e) +
              "\n\n" +
              f(e)
          );
        if (null != r && "object" == typeof r) {
          if (void 0 !== r.__k && void 0 !== r.__e)
            throw new Error(
              "Invalid type passed to createElement(): " +
                r +
                "\n\nDid you accidentally pass a JSX literal as JSX twice?\n\n  let My" +
                a(e) +
                " = " +
                w(r) +
                ";\n  let vnode = <My" +
                a(e) +
                " />;\n\nThis usually happens when you export a JSX literal and not the component.\n\n" +
                f(e)
            );
          throw new Error(
            "Invalid type passed to createElement(): " + (Array.isArray(r) ? "array" : r)
          );
        }
        if (
          void 0 !== e.ref &&
          "function" != typeof e.ref &&
          "object" != typeof e.ref &&
          !("$$typeof" in e)
        )
          throw new Error(
            'Component\'s "ref" property should be a function, or an object created by createRef(), but got [' +
              typeof e.ref +
              "] instead\n" +
              w(e) +
              "\n\n" +
              f(e)
          );
        if ("string" == typeof e.type)
          for (var i in e.props)
            if (
              "o" === i[0] &&
              "n" === i[1] &&
              "function" != typeof e.props[i] &&
              null != e.props[i]
            )
              throw new Error(
                "Component's \"" +
                  i +
                  '" property should be a function, but got [' +
                  typeof e.props[i] +
                  "] instead\n" +
                  w(e) +
                  "\n\n" +
                  f(e)
              );
        if ("function" == typeof e.type && e.type.propTypes) {
          if ("Lazy" === e.type.displayName && E && !E.lazyPropTypes.has(e.type)) {
            var s =
              "PropTypes are not supported on lazy(). Use propTypes on the wrapped component itself. ";
            try {
              var c = e.type();
              (E.lazyPropTypes.set(e.type, !0),
                console.warn(s + "Component wrapped in lazy() is " + a(c)));
            } catch (n) {
              console.warn(s + "We will log the wrapped component's name once it is loaded.");
            }
          }
          var l = e.props;
          (e.type.__f &&
            delete (l = (function (n, e) {
              for (var o in e) n[o] = e[o];
              return n;
            })({}, l)).ref,
            (function (n, e, o, r, a) {
              Object.keys(n).forEach(function (o) {
                var i;
                try {
                  i = n[o](e, o, r, "prop", null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (n) {
                  i = n;
                }
                i &&
                  !(i.message in t) &&
                  ((t[i.message] = !0),
                  console.error("Failed prop type: " + i.message + ((a && "\n" + a()) || "")));
              });
            })(e.type.propTypes, l, 0, a(e), function () {
              return f(e);
            }));
        }
        o && o(e);
      }));
    var T,
      _ = 0;
    ((e.__r = function (e) {
      (l && l(e), (n = !0));
      var o = e.__c;
      if ((o === T ? _++ : (_ = 1), _ >= 25))
        throw new Error(
          "Too many re-renders. This is limited to prevent an infinite loop which may lock up your browser. The component causing this is: " +
            a(e)
        );
      T = o;
    }),
      (e.__h = function (e, o, t) {
        if (!e || !n) throw new Error("Hook can only be invoked from render methods.");
        g && g(e, o, t);
      }));
    var O = function (n, e) {
        return {
          get: function () {
            var o = "get" + n + e;
            k &&
              k.indexOf(o) < 0 &&
              (k.push(o), console.warn("getting vnode." + n + " is deprecated, " + e));
          },
          set: function () {
            var o = "set" + n + e;
            k &&
              k.indexOf(o) < 0 &&
              (k.push(o), console.warn("setting vnode." + n + " is not allowed, " + e));
          },
        };
      },
      I = {
        nodeName: O("nodeName", "use vnode.type"),
        attributes: O("attributes", "use vnode.props"),
        children: O("children", "use vnode.props.children"),
      },
      M = Object.create({}, I);
    ((e.vnode = function (n) {
      var e = n.props;
      if (null !== n.type && null != e && ("__source" in e || "__self" in e)) {
        var o = (n.props = {});
        for (var t in e) {
          var r = e[t];
          "__source" === t ? (n.__source = r) : "__self" === t ? (n.__self = r) : (o[t] = r);
        }
      }
      ((n.__proto__ = M), c && c(n));
    }),
      (e.diffed = function (e) {
        var o,
          t = e.type,
          i = e.__;
        if (
          (e.__k &&
            e.__k.forEach(function (n) {
              if ("object" == typeof n && n && void 0 === n.type) {
                var o = Object.keys(n).join(",");
                throw new Error(
                  "Objects are not valid as a child. Encountered an object with the keys {" +
                    o +
                    "}.\n\n" +
                    f(e)
                );
              }
            }),
          e.__c === T && (_ = 0),
          "string" == typeof t && (y(t) || "p" === t || "a" === t || "button" === t))
        ) {
          var s = h(i);
          if ("" !== s && y(t))
            "table" === t && "td" !== s && y(s)
              ? console.error(
                  "Improper nesting of table. Your <table> should not have a table-node parent." +
                    w(e) +
                    "\n\n" +
                    f(e)
                )
              : ("thead" !== t && "tfoot" !== t && "tbody" !== t) || "table" === s
                ? "tr" === t && "thead" !== s && "tfoot" !== s && "tbody" !== s
                  ? console.error(
                      "Improper nesting of table. Your <tr> should have a <thead/tbody/tfoot> parent." +
                        w(e) +
                        "\n\n" +
                        f(e)
                    )
                  : "td" === t && "tr" !== s
                    ? console.error(
                        "Improper nesting of table. Your <td> should have a <tr> parent." +
                          w(e) +
                          "\n\n" +
                          f(e)
                      )
                    : "th" === t &&
                      "tr" !== s &&
                      console.error(
                        "Improper nesting of table. Your <th> should have a <tr>." +
                          w(e) +
                          "\n\n" +
                          f(e)
                      )
                : console.error(
                    "Improper nesting of table. Your <thead/tbody/tfoot> should have a <table> parent." +
                      w(e) +
                      "\n\n" +
                      f(e)
                  );
          else if ("p" === t) {
            var c = p(e).filter(function (n) {
              return m.test(n);
            });
            c.length &&
              console.error(
                "Improper nesting of paragraph. Your <p> should not have " +
                  c.join(", ") +
                  " as child-elements." +
                  w(e) +
                  "\n\n" +
                  f(e)
              );
          } else
            ("a" !== t && "button" !== t) ||
              (-1 !== p(e).indexOf(t) &&
                console.error(
                  "Improper nesting of interactive content. Your <" +
                    t +
                    "> should not have other " +
                    ("a" === t ? "anchor" : "button") +
                    " tags as child-elements." +
                    w(e) +
                    "\n\n" +
                    f(e)
                ));
        }
        if (((n = !1), r && r(e), null != e.__k))
          for (var l = [], u = 0; u < e.__k.length; u++) {
            var d = e.__k[u];
            if (d && null != d.key) {
              var v = d.key;
              if (-1 !== l.indexOf(v)) {
                console.error(
                  'Following component has two or more children with the same key attribute: "' +
                    v +
                    '". This may cause glitches and misbehavior in rendering process. Component: \n\n' +
                    w(e) +
                    "\n\n" +
                    f(e)
                );
                break;
              }
              l.push(v);
            }
          }
        if (null != e.__c && null != e.__c.__H) {
          var b = e.__c.__H.__;
          if (b)
            for (var g = 0; g < b.length; g += 1) {
              var E = b[g];
              if (E.__H)
                for (var k = 0; k < E.__H.length; k++)
                  if ((o = E.__H[k]) != o) {
                    var O = a(e);
                    console.warn(
                      "Invalid argument passed to hook. Hooks should not be called with NaN in the dependency array. Hook index " +
                        g +
                        " in component " +
                        O +
                        " was called with NaN."
                    );
                  }
            }
        }
      }));
  })());
export { c as getCurrentVNode, a as getDisplayName, f as getOwnerStack, r as resetPropWarnings };
//# sourceMappingURL=debug.module.js.map

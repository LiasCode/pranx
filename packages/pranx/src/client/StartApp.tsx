import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import { useHead } from "unhead";
import { UNHEAD_INSTANCE } from "./head.js";

let headUsed: ReturnType<typeof useHead> | null = null;

export function StartApp() {
  const HYDRATE_DATA = window.__PRANX_HYDRATE_DATA__;

  return (
    <LocationProvider>
      <ErrorBoundary onError={console.error}>
        <Router
          onRouteChange={() => {
            const current_route =
              window.__PRANX_HYDRATE_DATA__.routes.find((r) => r.path === window.location.pathname)
                ?.css || [];

            const head_css_config_links = current_route.map((p) => {
              return {
                href: p,
                rel: "stylesheet",
              };
            });

            if (headUsed !== null) {
              headUsed.patch({
                link: head_css_config_links,
              });
            } else {
              headUsed = useHead(UNHEAD_INSTANCE, {
                link: head_css_config_links,
              });
            }
          }}
        >
          {HYDRATE_DATA.routes.map((r) => {
            const Page = lazy(() => import(r.module));

            return (
              <Route
                key={r.path}
                path={r.path}
                component={() => <Page {...r.props} />}
              />
            );
          })}
          <Route
            default
            component={() => <h1>Not found</h1>}
          />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}

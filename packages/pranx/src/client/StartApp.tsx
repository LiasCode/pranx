import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import type { HydrateDataRoute } from "types/index.js";
import { useHead } from "unhead";
import { AppContextProvider } from "./AppContext.js";
import { exec_route_match } from "./exec-match.js";
import { UNHEAD_INSTANCE } from "./head.js";
import { ServerSidePage } from "./ServerSidePage.js";

let headUsed: ReturnType<typeof useHead> | null = null;

export function StartApp() {
  const HYDRATE_DATA = window.__PRANX_HYDRATE_DATA__;

  return (
    <AppContextProvider>
      <LocationProvider>
        <ErrorBoundary onError={console.error}>
          <Router
            onRouteChange={() => {
              let current_route: HydrateDataRoute | null = null;

              for (const r of window.__PRANX_HYDRATE_DATA__.routes) {
                const exec_result = exec_route_match(
                  window.location.pathname,
                  r.path_parsed_for_routing
                );

                if (exec_result) {
                  current_route = r;
                  break;
                }
              }

              const head_css_config_links = current_route?.css.map((p) => {
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
                  path={r.path_parsed_for_routing}
                  component={() => {
                    let props = r.props;

                    if (r.rendering_kind === "server-side") {
                      return (
                        <ServerSidePage
                          // biome-ignore lint/correctness/noChildrenProp: <>
                          children={<Page />}
                          route_data={r}
                        />
                      );
                    }

                    for (const route of r.static_generated_routes) {
                      if (route.path === window.location.pathname) {
                        props = route.props;
                        break;
                      }
                    }

                    return <Page {...props} />;
                  }}
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
    </AppContextProvider>
  );
}

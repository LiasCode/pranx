import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import { AppContextProvider } from "./AppContext.js";
import { ServerPage } from "./ServerPage.js";

export function StartApp() {
  return (
    <AppContextProvider>
      <LocationProvider>
        <ErrorBoundary onError={console.error}>
          <Router>
            {window.__PRANX_HYDRATE_DATA__.routes.map((r) => {
              const Page = lazy(() => import(r.module));

              return (
                <Route
                  key={r.path}
                  path={r.path_parsed_for_routing}
                  component={() => {
                    let props = r.props;

                    if (r.rendering_kind === "server-side") {
                      return (
                        <ServerPage>
                          <Page />
                        </ServerPage>
                      );
                    }

                    if (r.static_generated_routes.length === 0) {
                      return <Page {...props} />;
                    }

                    // For substatic generated routes
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

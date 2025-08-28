import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import { _useAppContext } from "./app-context.js";
import { NotFoundPage } from "./components/not-found-page.js";
import { ServerPage } from "./components/server-page.js";

export function AppRouter() {
  const { onRouteWillChange } = _useAppContext();

  return (
    <LocationProvider>
      <ErrorBoundary onError={console.error}>
        <Router onRouteChange={(url) => onRouteWillChange(url)}>
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

                  // For static generated subroutes
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
            component={NotFoundPage}
          />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}

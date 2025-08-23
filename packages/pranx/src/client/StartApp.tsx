import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";

export function StartApp() {
  const HYDRATE_DATA = window.__PRANX_HYDRATE_DATA__;

  return (
    <LocationProvider>
      <ErrorBoundary onError={console.error}>
        <Router>
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

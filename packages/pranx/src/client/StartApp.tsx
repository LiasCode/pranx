import { lazy, LocationProvider, Route, Router } from "preact-iso";

export function StartApp() {
  const HYDRATE_DATA = window.__PRANX_HYDRATE_DATA__;

  return (
    <LocationProvider>
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
      </Router>
    </LocationProvider>
  );
}

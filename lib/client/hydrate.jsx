//@ts-check

import { h, hydrate } from "preact";
import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import { ServerPage } from "./ServerPage.js";

const hydratePage = async () => {
  const pranxDataScript = document.getElementById("__PRANX_DATA__");

  if (!pranxDataScript || !pranxDataScript.textContent) {
    console.error("Pranx: Could not find __PRANX_DATA__ script for hydration.");
    return;
  }

  /**
   * @type {import("../types.js").HydrationData}
   */
  let pranxData = {
    pages_map: {},
  };

  try {
    pranxData = JSON.parse(pranxDataScript.textContent);
    console.dir(pranxData, { colors: true, compact: false, depth: Number.POSITIVE_INFINITY });
  } catch (e) {
    console.error("Pranx: Failed to parse __PRANX_DATA__:", e);
    return;
  }

  const { pages_map } = pranxData;

  const currentPath = window.location.pathname;

  const componentModulePath = pages_map[currentPath];

  if (componentModulePath) {
    try {
      const routes = [];

      for (const [path, data] of Object.entries(pages_map)) {
        const Component = lazy(() => import(data.entry_file));

        if (data.have_server_side_props) {
          routes.push(
            <Route
              path={path}
              component={() => (
                <ServerPage loader_path={path}>
                  <Component {...data.props} />
                </ServerPage>
              )}
            />
          );
        } else {
          routes.push(
            <Route
              path={path}
              component={() => h(Component, { ...data.props })}
            />
          );
        }
      }

      hydrate(
        <LocationProvider>
          <ErrorBoundary>
            <Router
              onRouteChange={(url) => {
                if (pages_map[url]) {
                  document.head.innerHTML = pages_map[url].meta;
                }
              }}
            >
              {...routes}
            </Router>
          </ErrorBoundary>
        </LocationProvider>,
        document.body
      );
    } catch (e) {
      console.error(
        `Pranx: Error hydrating component for path ${currentPath} from ${componentModulePath}:`,
        e
      );
    }
  } else {
    console.warn(
      `Pranx: No component module path found for client hydration for path: ${currentPath}`
    );
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydratePage);
} else {
  hydratePage();
}

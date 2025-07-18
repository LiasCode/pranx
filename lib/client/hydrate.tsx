//@ts-check
import { h, hydrate } from "preact";
import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";
import type { HydrationData } from "../types.js";
import { ServerPage } from "./ServerPage.js";
import { collectCurrentStylesheets, updateHead } from "./headDiff.js";

async function hydratePage() {
  collectCurrentStylesheets();
  const pranxDataScript = document.getElementById("__PRANX_DATA__");

  if (!pranxDataScript || !pranxDataScript.textContent) {
    console.error("Pranx: Could not find __PRANX_DATA__ script for hydration.");
    return;
  }

  let pranxData: HydrationData = {
    pages_map: {},
  };

  try {
    pranxData = JSON.parse(pranxDataScript.textContent);
  } catch (e) {
    console.error("Pranx: Failed to parse __PRANX_DATA__:", e);
    return;
  }

  const { pages_map } = pranxData;

  const current_path = window.location.pathname;

  const component_module_path = pages_map[current_path];

  if (!component_module_path) {
    console.warn(
      `Pranx: No component module path found for client hydration for path: ${current_path}`
    );
    return;
  }

  try {
    const routes = [];

    for (const [path, page_data] of Object.entries(pages_map)) {
      const Component = lazy(() => import(page_data.entry_file));

      if (page_data.have_server_side_props) {
        routes.push(
          <Route
            path={path}
            component={() => (
              <ServerPage loader_path={path}>
                <Component {...page_data.props} />
              </ServerPage>
            )}
          />
        );
      }

      if (page_data.isStatic) {
        routes.push(
          <Route
            path={path}
            component={() => h(Component, { ...page_data.props })}
          />
        );
      }
    }

    hydrate(
      <LocationProvider>
        <ErrorBoundary>
          <Router
            onLoadStart={(url) => {
              if (pages_map[url]) {
                updateHead(pages_map[url].meta);
              }
            }}
            onRouteChange={(url) => {
              if (pages_map[url]) {
                updateHead(pages_map[url].meta);
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
      `Pranx: Error hydrating component for path ${current_path} from ${component_module_path}:`,
      e
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydratePage);
} else {
  hydratePage();
}

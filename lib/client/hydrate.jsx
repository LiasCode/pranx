//@ts-check
import { h, hydrate } from "preact";
import { ErrorBoundary, lazy, LocationProvider, Route, Router } from "preact-iso";

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
    pageMap: {},
    pagePath: "",
    pageProps: {},
  };

  try {
    pranxData = JSON.parse(pranxDataScript.textContent);
  } catch (e) {
    console.error("Pranx: Failed to parse __PRANX_DATA__:", e);
    return;
  }

  const { pagePath, pageProps, pageMap } = pranxData;

  const currentPath = window.location.pathname;

  const componentModulePath = pagePath;

  if (componentModulePath) {
    try {
      const Component = (await import(componentModulePath)).default;

      const routes = [];

      for (const [p, f] of Object.entries(pageMap)) {
        if (p === pagePath.replace("page.js", "")) {
          routes.push(
            <Route
              path={p}
              component={() => h(Component, { ...pageProps }, null)}
            />
          );
        } else {
          const LazyComponent = lazy(() => import(f.public_file));
          routes.push(
            <Route
              path={p}
              component={() => <LazyComponent />}
            />
          );
        }
      }

      hydrate(
        <LocationProvider>
          <ErrorBoundary>
            <Router
              onRouteChange={(url) => {
                if (pageMap[url]) {
                  console.log({ url, pageMap, next_head: pageMap[url]?.head });
                  document.head.innerHTML = "";
                  document.head.innerHTML = pageMap[url]?.head;
                }
              }}
            >
              {...routes}
            </Router>
          </ErrorBoundary>
        </LocationProvider>,
        document.body
      );
      console.log(`Pranx: Page hydrated for path: ${currentPath}`);
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

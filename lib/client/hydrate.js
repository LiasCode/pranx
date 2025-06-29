//@ts-check
import { h, hydrate } from "preact";

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

  const { pagePath, pageProps } = pranxData;

  const currentPath = window.location.pathname;

  const componentModulePath = pagePath;

  if (componentModulePath) {
    try {
      // Dynamic import of the page component from the consumer's build directory
      // This path is relative to the client bundle root, which is the public/client/ dir
      // The `build.js` must ensure these paths are correct and bundled.
      const Component = (await import(componentModulePath)).default;
      hydrate(h(Component, { ...pageProps }), document.body);
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

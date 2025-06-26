//@ts-check
import { hydrate } from "preact";

const hydratePage = async () => {
  const prextDataScript = document.getElementById("__PREXT_DATA__");

  if (!prextDataScript || !prextDataScript.textContent) {
    console.error("Prext: Could not find __PREXT_DATA__ script for hydration.");
    return;
  }

  /**
   * @type {import("../types").HydrationData}
   */
  let prextData = {
    pageMap: {},
    pagePath: "",
    pageProps: {},
  };

  try {
    prextData = JSON.parse(prextDataScript.textContent);
  } catch (e) {
    console.error("Prext: Failed to parse __PREXT_DATA__:", e);
    return;
  }

  const { pagePath, pageProps } = prextData;

  const currentPath = window.location.pathname;

  const componentModulePath = pagePath;

  if (componentModulePath) {
    try {
      // Dynamic import of the page component from the consumer's build directory
      // This path is relative to the client bundle root, which is the public/client/ dir
      // The `build.js` must ensure these paths are correct and bundled.
      const Component = (await import(componentModulePath)).default;
      hydrate(<Component {...pageProps} />, document.body);
      console.log(`Prext: Page hydrated for path: ${currentPath}`);
    } catch (e) {
      console.error(`Prext: Error hydrating component for path ${currentPath} from ${componentModulePath}:`, e);
    }
  } else {
    console.warn(`Prext: No component module path found for client hydration for path: ${currentPath}`);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydratePage);
} else {
  hydratePage();
}

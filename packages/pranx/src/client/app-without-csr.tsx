import { lazy } from "preact-iso";
import { Suspense } from "preact/compat";
import { find_route } from "./shared/find-route.js";

export function AppWithOutCsr() {
  const current_route = find_route(window.location.pathname);

  if (current_route === null) {
    throw new Error("Route not found");
  }

  const Page = lazy(() => import(current_route.module));

  let props = current_route.props;

  if (current_route.rendering_kind === "server-side") {
    return (
      <Suspense fallback>
        <Page {...props} />
      </Suspense>
    );
  }

  if (current_route.static_generated_routes.length === 0) {
    return (
      <Suspense fallback>
        <Page {...props} />
      </Suspense>
    );
  }

  // For static generated subroutes
  for (const route of current_route.static_generated_routes) {
    if (route.path === window.location.pathname) {
      props = route.props;
      break;
    }
  }

  return (
    <Suspense fallback>
      <Page {...props} />
    </Suspense>
  );
}

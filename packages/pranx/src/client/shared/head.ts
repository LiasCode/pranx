import type { HydrateDataRoute } from "types/index";
import { useHead } from "unhead";
import { createHead, type Unhead } from "unhead/client";

export const UNHEAD_INSTANCE: Unhead = createHead();

let headUsed: ReturnType<typeof useHead> | null = null;

export const onRouteChangeUpdateHead = (route_data: HydrateDataRoute) => {
  const next_route = route_data;

  const head_css_config_links = next_route?.css.map((p) => {
    return {
      href: p,
      rel: "stylesheet",
    };
  });

  if (headUsed !== null) {
    headUsed.patch({
      link: head_css_config_links,
    });
  } else {
    headUsed = useHead(UNHEAD_INSTANCE, {
      link: head_css_config_links,
    });
  }
};

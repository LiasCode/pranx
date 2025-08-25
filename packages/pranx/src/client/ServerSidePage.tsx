import { ofetch } from "ofetch";
import { cloneElement, type VNode } from "preact";
import { Children, type PropsWithChildren, useLayoutEffect } from "preact/compat";
import type { HydrateDataRoute } from "types/index.js";
import { useAppContext } from "./AppContext.js";

export const ServerSidePage = (props: PropsWithChildren & { route_data: HydrateDataRoute }) => {
  const child = Children.only(props.children);
  const { _props, set } = useAppContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useLayoutEffect(() => {
    const props_fetch_handler = async () => {
      const abortController = new AbortController();

      try {
        const props_result = await ofetch<{ props: Record<string, any> }>(props.route_data.path, {
          method: "GET",
          query: {
            props: true,
          },
          signal: abortController.signal,
        });

        setTimeout(() => {
          set("props", props_result.props);
        }, 2000);
      } catch (error) {
        if (!(error instanceof Error)) return;

        if (error.name !== "AbortError") {
          console.error("Failed to fetch props:", error);
        }
      }

      return () => {
        abortController.abort();
      };
    };

    props_fetch_handler();
  }, []);

  return cloneElement(child as VNode, _props || props.route_data.props);
};

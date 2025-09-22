import { createContext } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { useCallback, useContext, useState } from "preact/hooks";
import { find_route } from "./shared/find-route";
import { onRouteChangeUpdateHead } from "./shared/head";

export type AppContext = {
  /** Props for the current server side page rendered  */
  _props: Record<string, any> | null;
  _props_status: "ready" | "loading" | "error";
  set(key: "props" | "prop_status", data: any): void;
  onRouteWillChange(next_route: string): Promise<boolean>;
};

const _app_context = createContext<AppContext>({
  _props: {},
  _props_status: "ready",
  set() {},
  onRouteWillChange: async () => false,
});

export const AppContextProvider = (props: PropsWithChildren) => {
  const [page_props, set_page_props] = useState<AppContext["_props"]>(() => {
    const current_route = find_route(window.location.pathname);
    return current_route?.props || null;
  });
  const [props_status, set_props_status] = useState<AppContext["_props_status"]>("ready");

  const set: AppContext["set"] = useCallback((key, data) => {
    if (key === "props") {
      set_page_props(data);
    }
    if (key === "prop_status") {
      set_props_status(data);
    }
  }, []);

  const onRouteWillChange = async (next_route: string): Promise<boolean> => {
    set_props_status("loading");
    const next_route_data = find_route(next_route);

    if (next_route_data === null) {
      console.error(`Route with value ${next_route} do not exits or not match`);
      set_props_status("error");
      return false;
    }

    if (next_route_data.rendering_kind === "static") {
      set_props_status("loading");
      onRouteChangeUpdateHead(next_route_data);
      return true;
    }

    try {
      const targetUrl = new URL(window.location.href);
      targetUrl.searchParams.set("props", "only");

      const response = await fetch(targetUrl);
      const json_data = (await response.json()) as { props: Record<string, any> };
      set_page_props(json_data.props);
      onRouteChangeUpdateHead(next_route_data);
      set_props_status("ready");
      return true;
    } catch (error) {
      if (!(error instanceof Error)) return false;
      console.error("Failed to fetch props:", error);
      set_props_status("error");
      return false;
    }
  };

  return (
    <_app_context.Provider
      value={{
        _props: page_props,
        _props_status: props_status,
        set,
        onRouteWillChange,
      }}
    >
      {props.children}
    </_app_context.Provider>
  );
};

export const _useAppContext = () => {
  const c = useContext(_app_context);
  if (!c) throw new Error("_useAppContext must be used within a AppContextProvider");
  return c;
};

const publicUseAppContext = () => {
  const c = useContext(_app_context);
  if (!c) throw new Error("useAppContext must be used within a AppContextProvider");
  return {
    props: c._props,
    props_status: c._props_status,
  };
};

export { publicUseAppContext as useAppContext };

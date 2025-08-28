import { ofetch } from "ofetch";
import { createContext } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { useCallback, useContext, useState } from "preact/hooks";
import { find_route } from "./find_route.js";
import { onRouteChangeUpdateHead } from "./head.js";

export type AppContext = {
  /** Props for the current server side page rendered  */
  _props: Record<string, any> | null;
  set(key: "props", data: any): void;
  onRouteWillChange(next_route: string): Promise<boolean>;
};

const _app_context = createContext<AppContext>({
  _props: {},
  set() {},
  onRouteWillChange: async () => false,
});

export const AppContextProvider = (props: PropsWithChildren) => {
  const [current_props, setCurrentProps] = useState<AppContext["_props"]>(() => {
    const current_route = find_route(window.location.pathname);
    return current_route?.props || null;
  });

  const set: AppContext["set"] = useCallback((key, data) => {
    if (key === "props") {
      setCurrentProps(data);
    }
  }, []);

  const onRouteWillChange = async (next_route: string): Promise<boolean> => {
    const next_route_data = find_route(next_route);

    if (next_route_data === null) {
      console.error(`Route with value ${next_route} do not exits or not match`);
      return false;
    }

    if (next_route_data.rendering_kind === "static") {
      onRouteChangeUpdateHead(next_route_data);
      return true;
    }

    try {
      const props_result = await ofetch<{ props: Record<string, any> }>(
        next_route_data.server_data_api_url,
        {
          method: "GET",
        }
      );
      setCurrentProps(props_result.props);
      onRouteChangeUpdateHead(next_route_data);
      return true;
    } catch (error) {
      if (!(error instanceof Error)) return false;
      console.error("Failed to fetch props:", error);
      return false;
    }
  };

  return (
    <_app_context.Provider
      value={{
        _props: current_props,
        set,
        onRouteWillChange,
      }}
    >
      {props.children}
    </_app_context.Provider>
  );
};

export const useAppContext = () => {
  const c = useContext(_app_context);
  if (!c) throw new Error("useAppContext must be used within a AppContextProvider");
  return c;
};

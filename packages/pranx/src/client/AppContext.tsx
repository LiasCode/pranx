import { createContext } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { useCallback, useContext, useState } from "preact/hooks";
import { find_current_route } from "./StartApp.js";

export type AppContext = {
  _params: Record<string, string> | null;
  _props: Record<string, any> | null;
  set(key: "params" | "props", data: any): void;
};

const _app_context = createContext<AppContext>({
  _params: {},
  _props: {},
  set() {},
});

export const useAppContext = () => {
  const c = useContext(_app_context);
  if (!c) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return c;
};

export const AppContextProvider = (props: PropsWithChildren) => {
  const [current_props, setCurrentProps] = useState<AppContext["_props"]>(() => {
    const current_route = find_current_route();
    return current_route?.props || null;
  });
  const [current_params, setCurrentParams] = useState<AppContext["_params"]>(null);

  const set: AppContext["set"] = useCallback((key, data) => {
    if (key === "params") {
      setCurrentParams(data);
    } else {
      setCurrentProps(data);
    }
  }, []);

  return (
    <_app_context.Provider
      value={{
        _params: current_params,
        _props: current_props,
        set,
      }}
    >
      {props.children}
    </_app_context.Provider>
  );
};

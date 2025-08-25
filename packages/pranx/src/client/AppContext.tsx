import { createContext } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { useContext, useState } from "preact/hooks";

export type AppContext = {
  _params: Record<string, string> | null;
  _props: Record<string, any> | null;
  set(key: "params" | "props", data: any): void;
};

const AppContextInstance = createContext<AppContext>({
  _params: {},
  _props: {},
  set() {},
});

export const useAppContext = () => {
  const c = useContext(AppContextInstance);
  if (!c) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return c;
};

export const AppContextProvider = (props: PropsWithChildren) => {
  const [current_props, setCurrentProps] = useState<AppContext["_props"]>(null);
  const [current_params, setCurrentParams] = useState<AppContext["_params"]>(null);

  return (
    <AppContextInstance.Provider
      value={{
        _params: current_params,
        _props: current_props,
        set(key, data) {
          if (key === "params") {
            setCurrentParams(data);
          } else {
            setCurrentProps(data);
          }
        },
      }}
    >
      {props.children}
    </AppContextInstance.Provider>
  );
};

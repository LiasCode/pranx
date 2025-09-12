import { AppContextProvider } from "./app-context";
import { AppWithOutCsr } from "./app-without-csr";
import { AppRouter } from "./router";

export function StartApp() {
  if (window.pranx.csr_enabled === false) {
    return <AppWithOutCsr />;
  }

  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

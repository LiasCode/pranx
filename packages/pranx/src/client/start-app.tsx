import { AppContextProvider } from "./app-context.js";
import { AppWithOutCsr } from "./app-without-csr.js";
import { AppRouter } from "./router.js";

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

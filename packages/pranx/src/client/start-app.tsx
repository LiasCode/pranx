import { AppContextProvider } from "./app-context.js";
import { AppRouter } from "./router.js";

export function StartApp() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

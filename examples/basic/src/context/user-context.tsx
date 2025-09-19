import { createContext } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { useContext, useState } from "preact/hooks";

type User = {
  id: string;
  name: string;
  age: number;
};

const userContext = createContext<{
  user: User | null;
  setUser: (u: User | null) => void;
}>({
  user: null,
  setUser() {},
});

export const UserProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>({
    id: "1",
    age: 20,
    name: "Raul",
  });

  return (
    <userContext.Provider
      value={{
        setUser: (u) => {
          setUser(u);
        },
        user,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  const c = useContext(userContext);
  if (!c) throw new Error("useUserContext should be inside of an UserProvider");
  return c;
};

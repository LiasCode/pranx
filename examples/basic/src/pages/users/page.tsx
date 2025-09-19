import { Header } from "src/components/Header";
import { useUserContext } from "src/context/user-context";

export default function UsersPage() {
  const { user, setUser } = useUserContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div class="flex flex-col gap-4 p-6 max-w-3xl mx-auto">
        <h1>Users Page</h1>
        <span>ID: {user?.id}</span>
        <span>Name: {user?.name}</span>
        <span>Age: {user?.age}</span>

        <button
          type="button"
          onClick={() => {
            setUser({
              id: "29",
              age: Math.trunc(Math.random() * 20),
              name: "Jose",
            });
          }}
        >
          Update info
        </button>
      </div>
    </div>
  );
}

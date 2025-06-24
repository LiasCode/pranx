import { Suspense } from "preact/compat";
import { Button } from "../components/Button";

export default function Page() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <h1>This is the first prext page rendered</h1>

      <a href="/blog">Blog</a>

      <Button>Click Me</Button>

      <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
        <Suspense fallback={<h2>Loading</h2>}>
          <div>Component Inside a Suspense</div>
        </Suspense>
      </div>
    </div>
  );
}

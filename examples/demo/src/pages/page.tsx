import { MetaFunction } from "pranx";
import { Suspense } from "preact/compat";
import { Button } from "../components/Button";
import { CounterButton } from "../components/CounterButton";
import Guide from "../components/Guide.md";
import Layout from "../layout/layout";

export const meta: MetaFunction = async () => {
  return (
    <>
      <title>Home | Pranx</title>
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />
    </>
  );
};

export default function Page() {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h1>This is the first pranx page rendered</h1>

        <Button>Click Me</Button>

        <CounterButton />

        <Guide />

        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <Suspense fallback={<h2>Loading</h2>}>
            <div>Component Inside a Suspense</div>
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}

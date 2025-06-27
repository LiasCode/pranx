import { Suspense } from "preact/compat";
import { Button } from "../../components/Button";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";
import mockData from "./data.json";

export default function JSONPage() {
  console.log({ mockData });
  return (
    <Layout>
      <>
        <h1>This </h1>

        <Button>Click Me</Button>

        <CounterButton />

        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <Suspense fallback={<h2>Loading</h2>}>
            <div>Component Inside a Suspense</div>
          </Suspense>
        </div>
      </>
    </Layout>
  );
}

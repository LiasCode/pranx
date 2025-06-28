import { MetaFunction } from "@pranx";
import { Suspense } from "preact/compat";
import { Button } from "../../components/Button";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";
import mockData from "./data.json";

export const meta: MetaFunction = async () => {
  return (
    <>
      <title>JSON | Pranx</title>
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />
    </>
  );
};

export default function JSONPage() {
  if (typeof window !== "undefined") {
    console.log({ mockData });
  }
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
        <h1>This page is for test loading .json files </h1>

        <Button>Click Me</Button>

        <CounterButton />

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

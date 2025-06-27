import { MetaFunction } from "@prext";
import { Button } from "../../components/Button";
import Layout from "../../layout/layout";
import "./index.css";

export const meta: MetaFunction = async () => {
  return (
    <>
      <title>About | Prext</title>
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
        <h1>About Page</h1>
        <Button>This is a button</Button>
      </div>
    </Layout>
  );
}

import { Button } from "../../components/Button";
import Layout from "../../layout/layout";
import "./index.css";

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

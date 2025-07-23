import { Layout } from "../../layout/layout";
import docsStyles from "./docs.module.css";

export default function DocsPage() {
  return (
    <Layout>
      <h1 class={docsStyles.title}>Docs Page</h1>
    </Layout>
  );
}

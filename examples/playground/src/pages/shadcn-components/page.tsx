import { CardExample } from "@/components/card-example";
import { DialogDemo } from "@/components/dialog-demo";
import { TableWithActions } from "@/components/table-example";
import { Layout } from "../../layout/layout";

export default function ShadcnPage() {
  return (
    <Layout>
      <h1 class={"text-2xl mb-4"}>Shadcn Components</h1>

      <CardExample />

      <div class={"my-4"}></div>

      <DialogDemo />

      <div class={"my-4"}></div>

      <TableWithActions />
    </Layout>
  );
}

import { Layout } from "../../../layout/layout";

export default function ProductDetails(props: { id: string }) {
  console.log("Product Details Props", { props });

  return (
    <Layout>
      <h1>Product Details</h1>
      {props.id}
    </Layout>
  );
}

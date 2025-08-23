import type { GetStaticPropsFunction, InferProps } from "pranx";
import { Header } from "src/components/Header";
import "./products.css";

export default function ProductsPage(props: InferProps<typeof getStaticProps>) {
  return (
    <div>
      <Header />
      <h1>Products</h1>
      Cuantity : {props.cuantity}
    </div>
  );
}

export const getStaticProps: GetStaticPropsFunction<{ cuantity: number }> = async () => {
  return {
    props: {
      cuantity: 2,
    },
  };
};

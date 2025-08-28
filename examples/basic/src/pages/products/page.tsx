import type { GetServerSidePropsFunction } from "pranx";
import { Header } from "src/components/Header";
import "./products.css";

export default function ProductsPage(props: { cuantity: number }) {
  return (
    <div>
      <Header />
      <h1>Products</h1>
      Cuantity : {props.cuantity}
    </div>
  );
}

export const getServerSideProps: GetServerSidePropsFunction<{
  cuantity: number;
}> = async () => {
  return {
    cuantity: Math.trunc(Math.random() * 10 * 5),
  };
};

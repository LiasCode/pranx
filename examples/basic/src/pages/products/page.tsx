import { Header } from "src/components/Header";
import { GetServerSidePropsFunction } from "../../../../../packages/pranx/types/index";
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
    cuantity: 1,
  };
};

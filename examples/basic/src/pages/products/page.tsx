import { useAppContext, type GetServerSidePropsFunction } from "pranx";
import { Header } from "src/components/Header";
import "./products.css";

export default function ProductsPage(props: { cuantity: number }) {
  const { props_status } = useAppContext();
  console.log(props_status);
  return (
    <div>
      <Header />
      <h1>Products</h1>
      {props_status === "ready" && (
        <>
          Cuantity : {props.cuantity}
          <br />
          <span>Status: {props_status}</span>
        </>
      )}
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

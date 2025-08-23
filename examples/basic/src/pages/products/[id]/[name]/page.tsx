import { GetStaticPathsFunction } from "pranx";
import { Header } from "src/components/Header";

export default function ProductIdPage() {
  return (
    <div>
      <Header />
      <h1>Products id</h1>
    </div>
  );
}

export const getStaticPaths: GetStaticPathsFunction = async () => {
  return {
    paths: [{ params: { name: "1" } }, { params: { name: "2" } }],
    fallback: false,
  };
};

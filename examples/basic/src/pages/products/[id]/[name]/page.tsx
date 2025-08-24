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

export const getStaticPaths: GetStaticPathsFunction<{ id: string; name: string }> = async () => {
  return {
    paths: [{ params: { name: "Pedro", id: "1" } }, { params: { name: "Juan", id: "2" } }],
    fallback: false,
  };
};

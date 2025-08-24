import { GetStaticPathsFunction, GetStaticPropsFunction, InferStaticProps } from "pranx";
import { Header } from "src/components/Header";

export default function ProductIdPage(props: InferStaticProps<typeof getStaticProps>) {
  return (
    <div>
      <Header />
      <h1>Product Detail for id</h1>
      <span>{props.id}</span>
    </div>
  );
}

export const getStaticPaths: GetStaticPathsFunction<{ id: string }> = async () => {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticPropsFunction<{ id: string }, { id: string }> = async (
  context
) => {
  return {
    props: {
      id: context.params.id,
    },
  };
};

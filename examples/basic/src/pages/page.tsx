import type { GetStaticPropsFunction, InferStaticProps } from "pranx";
import { useState } from "preact/hooks";
import { Header } from "src/components/Header";
import Docs from "../components/Docs.md";

export default function HomePage(props: InferStaticProps<typeof getStaticProps>) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div class="flex flex-col gap-4 p-6 max-w-3xl mx-auto">
        <h1 class="text-3xl">Home Page</h1>
        <button
          class="p-2 border rounded-3xl text-white w-fit"
          type="button"
          onClick={() => {
            setCount(count + 1);
          }}
        >
          Counter +1: {count}
        </button>

        <h1>Title {props.title}</h1>

        <div class="markdown-body">
          <Docs />
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticPropsFunction<{ title: string }> = async () => {
  return {
    props: {
      title: "hola",
    },
  };
};

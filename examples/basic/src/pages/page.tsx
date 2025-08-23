import type { GetStaticPropsFunction, InferProps } from "pranx";
import { useState } from "preact/hooks";
import { Header } from "src/components/Header";
import Docs from "../components/Docs.md";

export default function HomePage(props: InferProps<typeof getStaticProps>) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <h1 style={{ fontSize: "4rem" }}>Home Page</h1>
      <h2 style={{ fontSize: "2rem" }}>Titulo h2</h2>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Counter +1 {"--->"} {count}
      </button>
      <h1>Title {props.title}</h1>

      <Docs />
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

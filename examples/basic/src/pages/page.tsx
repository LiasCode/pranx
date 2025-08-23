import type { GetStaticPropsFunction, InferProps } from "pranx";
import { useState } from "preact/hooks";
import { Header } from "src/components/Header";

export default function HomePage(props: InferProps<typeof getStaticProps>) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <h1 style={{ fontSize: "4rem" }}>Home Page</h1>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Counter +1 {"--->"} {count}
      </button>
      <h1>Title {props.title}</h1>
    </div>
  );
}

export const getStaticProps: GetStaticPropsFunction<{ title: string }> = async (props) => {
  console.log("getStaticProps", props);

  return {
    props: {
      title: "hola",
    },
  };
};

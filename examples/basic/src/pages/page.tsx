import type { GetStaticProps } from "pranx";
import { useState } from "preact/hooks";
import { Header } from "src/components/Header";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <h1 style={{ fontSize: "4rem" }}>Home Page</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Counter +1 {"--->"} {count}
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    title: "hola",
  };
};

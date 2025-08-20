import type { GetStaticProps } from "pranx";

export default function HomePage() {
  return (
    <div>
      <a href="/about">Go to About Page</a>
      <h1 style={{ fontSize: "4rem" }}>Home Page</h1>
    </div>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    title: "hola",
  };
};

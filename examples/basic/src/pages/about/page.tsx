import { readFile } from "node:fs/promises";
import type { GetStaticProps } from "pranx";
import { Header } from "src/components/Header";

export default function AboutPage() {
  return (
    <div>
      <Header />
      <h1 style={{ fontSize: "4rem" }}>About Page</h1>
    </div>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    title: "hola",
  };
};

export async function getServerSideProps() {
  const res = readFile("", { encoding: "utf-8" });
  return res;
}

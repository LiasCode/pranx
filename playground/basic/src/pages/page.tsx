import type { GetStaticProps } from "pranx";
import "./home.css";

export default function HomePage() {
  return <div>Home Page</div>;
}

export const getStaticProps: GetStaticProps = () => {
  return {
    title: "hola",
  };
};

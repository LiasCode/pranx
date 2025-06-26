import { GetStaticPropsResult } from "@prext";
import { GetStaticProps } from "../../../../../lib/types";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();

  return {
    props: {
      posts,
    },
  };
};

export default function Page(props: GetStaticPropsResult["props"]) {
  return (
    <Layout>
      <h1>This Blog Page Is Prerendered</h1>
      <CounterButton />
      <ul>
        {props.posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </Layout>
  );
}

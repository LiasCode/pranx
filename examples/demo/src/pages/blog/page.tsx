import { GetStaticPropsResult } from "@prext";
import { GetStaticProps } from "../../../../../lib/types";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";

export const getStaticProps: GetStaticProps = async () => {
  // const data = await fetch("https://api.vercel.app/blog");
  // const posts = await data.json();
  const posts = [
    // ONLY SERVER OPEN
    {
      id: "1",
      title: "First Step",
    },
    // ONLY SERVER END
    {
      id: "2",
      title: "Second Step, prerendering",
    },
    {
      id: "3",
      title: "Third Step, generating",
    },
  ];

  return {
    props: {
      posts,
    },
  };
};

export default function Page(props: GetStaticPropsResult["props"]) {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h1>
          This Blog Page Is Prerendered with <code>getStaticProps</code>
        </h1>
        <CounterButton />
        <ul>
          {props.posts.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

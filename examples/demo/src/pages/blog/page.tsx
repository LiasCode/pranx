import { GetStaticPropsResult } from "pranx";
import { GetStaticProps, MetaFunction } from "../../../../../lib/types";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";

export const meta: MetaFunction = async () => {
  return (
    <>
      <title>Blog | Pranx</title>
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // const data = await fetch("https://api.vercel.app/blog");
  // const posts = await data.json();
  const posts = [
    {
      id: "1",
      title: "First Step",
    },

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

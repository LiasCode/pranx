import type { GetStaticProps } from "pranx";
import posts from "./data.json";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      posts: posts,
    },
  };
};

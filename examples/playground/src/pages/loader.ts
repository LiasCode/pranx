import type { GetStaticProps } from "pranx";
import posts from "../data/data.json";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      posts: posts,
    },
  };
};

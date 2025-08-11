import type { GetStaticProps } from "pranx";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "Home Page",
      description: "Welcome to the home page of our Pranx application.",
    },
  };
};

import type { GetServerSideProps } from "pranx";

let counter = 0;

export const getServerSideProps: GetServerSideProps = async (c) => {
  counter++;
  return {
    title: "Test " + counter,
    method: c.req.method,
  };
};

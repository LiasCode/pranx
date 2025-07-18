import type { GetServerSideProps } from "pranx";

export const getServerSideProps: GetServerSideProps = async (c) => {
  const id = c.req.param("id");

  return {
    id,
  };
};

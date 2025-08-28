import type { GetServerSidePropsFunction } from "pranx";
import { Header } from "src/components/Header";

export default function ProductIdPage(props: { id: string; name: string }) {
  return (
    <div>
      <Header />
      <h1>Products id</h1>
      <div className={"flex flex-col gap-2 font-bold"}>
        <span>id: {props.id}</span>
        <span>Name: {props.name}</span>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSidePropsFunction<{
  id: string;
  name: string;
}> = async ({ event }) => {
  return event.context.params as { id: string; name: string };
};

import { Layout } from "../../layout/layout";

export default function ServerPropsPage(props: { title: string }) {
  return (
    <Layout>
      <h1>With Server Props Page</h1>
      <h2>Title via props: {props.title}</h2>
    </Layout>
  );
}

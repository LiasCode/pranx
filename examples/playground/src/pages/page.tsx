import { Layout } from "@/layout/layout";
import { HooksTest } from "../components/HooksTest";
import { MdTest } from "../components/MdTest";
import { SignalsTest } from "../components/SignalsTest";
import "./home.scss";

export default function HomePage(props: { posts: { id: string; title: string }[] }) {
  return (
    <Layout>
      <div id="home-page">
        <h1>Demo | Pranx test playground</h1>

        <div class="separator-horizontal"></div>

        <h2>Statics Props</h2>

        <div class="separator-horizontal"></div>

        {props.posts?.map((p) => (
          <div key={p.id}>
            <span>{p.title}</span>
          </div>
        ))}

        <div class="separator-horizontal"></div>

        <SignalsTest />

        <div class="separator-horizontal"></div>

        <MdTest />

        <div class="separator-horizontal"></div>

        <HooksTest />
        <div class="separator-horizontal"></div>
      </div>
    </Layout>
  );
}

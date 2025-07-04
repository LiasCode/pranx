import type { MetaFunction } from "pranx";
import { HooksTest } from "../components/HooksTest";
import { MdTest } from "../components/MdTest";
import { SignalsTest } from "../components/SignalsTest";
import { Layout } from "../layout/layout";
import "./home.scss";

export const meta: MetaFunction = async () => {
  return (
    <>
      <meta charset="utf-8" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

      <title>Demo | Pranx test playground</title>

      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />

      <meta
        name="color-scheme"
        content="light dark"
      />
      <meta
        name="theme-color"
        content="#ffffff"
      />

      <meta
        name="author"
        content="LiasCode"
      />
    </>
  );
};

export default function HomePage(props: { posts: { id: string; title: string }[] }) {
  return (
    <Layout>
      <div id="home-page">
        <h1>Demo | Pranx test playground</h1>

        <div class="separator-horizontal"></div>

        <h2>Statics Props</h2>

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

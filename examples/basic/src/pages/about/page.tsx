import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { GetStaticPropsFunction, InferStaticProps } from "pranx";
import { Header } from "src/components/Header";
import aboutStyles from "./about.module.css";

export default function AboutPage(props: InferStaticProps<typeof getStaticProps>) {
  return (
    <div>
      <Header />
      <h1 className={aboutStyles.title}>About Page</h1>
      <pre>{props.file_content}</pre>
    </div>
  );
}

export const getStaticProps: GetStaticPropsFunction<{ file_content: string }> = async () => {
  const res = await readFile(join(process.cwd(), "package.json"), {
    encoding: "utf-8",
  });

  return {
    props: {
      file_content: JSON.stringify(JSON.parse(res), null, 2),
    },
  };
};

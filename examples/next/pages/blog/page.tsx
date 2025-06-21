import { PageConfig } from "../../../../lib/router/next-file-base-router";
import { CounterButton } from "../../components/CounterButton";

export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();

  // const posts = [
  //   { id: 1, title: "First Post" },
  //   { id: 2, title: "Second Post" },
  // ];

  return (
    <>
      <h1>This is the first prext page rendered</h1>
      <CounterButton />
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}

export const config: PageConfig = {
  static: false,
};

import { PageConfig } from "@prext";

export default function Page() {
  const posts: { title: string; id: string }[] = [
    {
      id: "1",
      title: "test -1",
    },
    {
      id: "2",
      title: "test -2",
    },
  ];

  return (
    <div>
      <h1>This is the first prext page rendered</h1>

      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export const config: PageConfig = {
  static: false,
};

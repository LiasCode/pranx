import { CounterButton } from "../../components/CounterButton";

export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();

  return (
    <html>
      <head>
        <title>Blog | Prext Page</title>
      </head>
      <body>
        <h1>This is the first prext page rendered</h1>
        <CounterButton />
        <ul>
          {posts.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </body>
    </html>
  );
}

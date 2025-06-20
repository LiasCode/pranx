import { CounterButton } from "../components/CounterButton";

export default function Page() {
  return (
    <html>
      <head>
        <title>Prext Page</title>
      </head>
      <body
        style={{ display: "flex", flexDirection: "column", gap: "2", justifyContent: "center", alignItems: "center" }}
      >
        <h1>This is the first prext page rendered</h1>
        <CounterButton />
        <a href="/blog">Blog</a>
      </body>
    </html>
  );
}

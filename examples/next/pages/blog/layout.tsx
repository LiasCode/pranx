import { PropsWithChildren } from "preact/compat";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>Blog | Prext Page</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
      </head>
      <body
        style={{ display: "flex", flexDirection: "column", gap: "2", justifyContent: "center", alignItems: "center" }}
      >
        {props.children}
      </body>
    </html>
  );
}

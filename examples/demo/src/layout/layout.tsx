import { PropsWithChildren } from "preact/compat";

export default function Layout(props: PropsWithChildren<{ title: string }>) {
  return (
    <html>
      <head>
        <title>{props.title}</title>
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

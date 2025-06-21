import { PropsWithChildren } from "preact/compat";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>Prext Page</title>
      </head>
      <body
        style={{ display: "flex", flexDirection: "column", gap: "2", justifyContent: "center", alignItems: "center" }}
      >
        {props.children}
      </body>
    </html>
  );
}

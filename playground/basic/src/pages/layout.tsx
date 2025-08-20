import { Scripts } from "pranx";
import type { PropsWithChildren } from "preact/compat";
import "./layout.css";

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Pranx Basic Template</title>
      </head>
      <body>
        {props.children}
        <Scripts />
      </body>
    </html>
  );
}

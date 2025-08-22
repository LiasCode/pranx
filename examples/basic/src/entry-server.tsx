import { Meta, Scripts, type ServerEntryProps } from "pranx";

export default function ServerEntry({ children }: ServerEntryProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Pranx Basic Template</title>
        <Meta />
      </head>
      <body>
        <div id="app">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

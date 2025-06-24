import { Button } from "../../components/Button";
import "./index.css";

export default function Page() {
  return (
    <html>
      <head>
        <title>About | Prext Page</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
      </head>
      <body>
        <h1>About Page</h1>
        <Button>This is a button</Button>
      </body>
    </html>
  );
}

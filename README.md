### Pranx

The next of preact.

A light-weight, Next.js-like framework with Preact, Hono, esbuild and swc for static site generation, server side rendering and hydration.

### Features

- [x] File-System Based Routing
- [x] Api handlers
- [x] Static Site Generation (SSG)
- [x] Server Side Rendering (SSR)
- [x] Client Side Routing
- [x] Automatic Hydration
- [x] Fully typescript support
- [x] Fast compilation with esbuild
- [x] CSS importing and automatic bundle
- [x] Extensible esbuild config with plugins
- [x] Markdown and .mdx support
- [x] Sass support
- [x] Tailwindcss support
- [ ] Hot Module Replacement (HMR)

### Usage

#### Using a template

```bash
npx degit https://github.com/LiasCode/pranx-basic-starter-template my-pranx-app
```

### Routing

The routing system start with the definition of the `pages` path.
The default path is `src/pages`
It can be customize in the `pranx.config.js` file.

```js
import { defineConfig } from "pranx";
import { mdx_plugin, sass_plugin } from "pranx/plugins";

export default defineConfig({
  esbuild: {
    plugins: [mdx_plugin(), sass_plugin()],
  },
});
```

The public dir it's serve as it, for the server as statics and public assets. Will not be transformed.
The default path is `public`

Inside the pages folder each file name represents a part of the app.

- `page.{tsx,jsx,js,ts}`: The page that will be rendered as html and hydratated to the client.

- `meta.{tsx,jsx,js,ts}`: Contains the page metadata

- `route.{tsx,jsx,js,ts}`: Contains api handler only for the server.

- `loader.{tsx,jsx,js,ts}`: Contains the loader function to pass data as props to the page.

The file path also represent the final url path that will be generated:

- `pages/page.tsx`: `/`
- `pages/blog/page.tsx`: `/blog/`
- `pages/product/[id]/page.tsx`: `/product/:id`

> Work in progress for pages

- `pages/product/[...id]/page.tsx`: `/product/:id*`

#### page.tsx

Export the page element

Example:

`pages/page.tsx`

```tsx
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/compat";
import { Layout } from "../layout/layout";
import Docs from "./docs.md";
import "./home.scss";

export default function HomePage(props: { msg: string }) {
  const count = useSignal(0);

  useEffect(() => {
    console.log("Hello World");
  }, []);

  return (
    <Layout>
      <div id="home-page">
        <h1>Home</h1>
        <button
          onClick={() => {
            count.value = count.value + 1;
            console.log(count.value);
          }}
        >
          A simple Counter {"->"} {count.value}
        </button>

        <span>{props.msg}</span>

        <Docs />
      </div>
    </Layout>
  );
}
```

#### meta.ts

Export the function that generate the head metadata for the page

Example:

`pages/meta.tsx`

```tsx
import type { MetaFunction } from "pranx";

export const meta: MetaFunction = async () => {
  return (
    <>
      <meta charset="utf-8" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

      <title>Home | Example</title>

      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />

      <meta
        name="color-scheme"
        content="light dark"
      />
      <meta
        name="theme-color"
        content="#ffffff"
      />

      <meta
        name="author"
        content="LiasCode"
      />
    </>
  );
};
```

#### loader.ts

Export methods that define the way to render the page and generate the props

Example:

`pages/loader.ts`

```tsx
import type { GetStaticProps } from "pranx";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      msg: "Hello from the static prop",
    },
  };
};
```

#### route.ts

Can export api named methods that will be attached to hono server router

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Example:

`pages/api/product/[id]/route.ts`

```tsx
import type { PranxHandler } from "pranx";

export const GET: PranxHandler = (c) => {
  const id = c.req.param("id");
  return c.json({ id, method: "get" });
};

export const POST: PranxHandler = (c) => {
  const id = c.req.param("id");
  return c.json({ id, method: "post" });
};
```

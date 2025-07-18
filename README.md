### Pranx

The next of preact.

A light-weight, Next.js-like framework with Preact, Hono, esbuild and swc for static site generation, server side rendering and hydration.

### Features

- [x] File-System Based Routing
- [x] Api handlers
- [x] Static Site Generation (SSG)
- [x] Client Side Routing
- [x] Client-Side Hydration
- [x] Fully typescript support
- [x] Fast compilation with esbuild
- [x] CSS importing and automatic bundle
- [x] Extensible esbuild config with plugins
- [x] Markdown and .mdx support
- [x] Sass support
- [x] SSR
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

> Work in progress for pages

- `pages/product/[id]/page.tsx`: `/product/:id`
- `pages/product/[...id]/page.tsx`: `/product/:id*`

#### page.tsx

Export the page element

Example:

`pages/blog/page.tsx`

```tsx
import { GetStaticPropsResult } from "pranx";
import type { GetStaticProps, MetaFunction } from "pranx";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";

export default function Page(props: GetStaticPropsResult["props"]) {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h1>
          This Blog Page Is Prerendered with <code>getStaticProps</code>
        </h1>
        <CounterButton />
        <ul>
          {props.posts.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
```

#### meta.ts

Export the function that generate the head metadata for the output html

Example:

`pages/blog/meta.tsx`

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
      <title>Demo | Pranx test playground</title>
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

Export methods that will be passed to the page component as props

Example:

`pages/blog/loader.tsx`

```tsx
import type { GetStaticProps } from "pranx";
import posts from "../data/data.json";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      posts: posts,
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

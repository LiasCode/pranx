### Pranx

The next of preact.

A light-weight, Next.js-like framework with Preact, Hono, esbuild and swc for static site generation, server side rendering and hydration.

### Features

- [x] File-System Based Routing
- [x] Api handlers
- [x] Static Site Generation (SSG)
- [ ] SSR
- [ ] Client Side Routing
- [x] Client-Side Hydration
- [x] Fully typescript support
- [ ] Hot Module Replacement (HMR)
- [x] Fast compilation with esbuild
- [x] CSS importing and automatic bundle
- [x] Markdown and .mdx support
- [x] Sass support
- [ ] Extensible esbuild config

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

export default defineConfig({
  pages_dir: "",
  public_dir: "",
});
```

The public dir it's serve as it, for the server as statics and public assets. Will not be transformed.
The default path is `public`

Inside the pages folder each file name represents a part of the app.

`page.{tsx,jsx,js,ts}` -> The page that will be rendered as html and hydratated to the client.

`route.{tsx,jsx,js,ts}` -> Contains api handler only for the server.

The file path also represent the final url path that will be generated:

- `pages/page.tsx` -> `/`
- `pages/blog/page.tsx` -> `/blog/`

> Work in progress

- `pages/product/[id]/page.tsx` -> `/product/:id`
- `pages/product/[...id]/page.tsx` -> `/product/:id*`

#### page.tsx

Can export several methods.

- `default` -> page component will be rendered
- `meta` -> meta description for the `head` tag
- `getStaticProps`
  > Work in progress
- `getStaticPath`
- `getServerSideProps`

Example:

`pages/blog/page.tsx`

```tsx
import { GetStaticPropsResult } from "pranx";
import type { GetStaticProps, MetaFunction } from "pranx";
import { CounterButton } from "../../components/CounterButton";
import Layout from "../../layout/layout";

export const meta: MetaFunction = async () => {
  return (
    <>
      <title>Blog | Pranx</title>
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.json();

  return {
    props: {
      posts,
    },
  };
};

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

### Pranx

The next of preact.

A light-weight, Next.js-like framework with Preact, Hono, and esbuild for static site generation and hydration.

### Features

- [x] File-System Based Routing
- [x] Api handlers
- [x] Static Site Generation (SSG)
- [ ] SSR
- [ ] Client Side Routing
- [x] Client-Side Hydration
- [x] Fully typescript support
- [ ] Hot Module Replacement (HMR)
- [X] Fast compilation with esbuild

### Usage

1- Create a hono project and select the `nodejs` adapter

```bash
npm create hono@latest
```

2- Add pranx

```bash
npm install pranx@latest
```

3- Update the tsconfig.json file

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "es2022",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",

    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedParameters": true,

    "jsx": "react-jsx",
    "jsxImportSource": "preact",

    "skipLibCheck": true,
    "checkJs": true
  },
  "exclude": ["node_modules"],
  "include": ["src"]
}
```

4- Update the entry point, default should be `src/index.ts`

```ts
import { serve } from "@hono/node-server";
import { pranx } from "pranx";

const app = await pranx.init({
  mode: "prod",
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3030,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
```

5- Create the `pranx.config.js` file at the root of your project:

```js
import { defineConfig } from "pranx";

export default defineConfig({});
```

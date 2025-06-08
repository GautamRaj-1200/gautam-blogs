## TODO

- [ ] commitlint
- [ ] husky

# ⚡️ Next.js Starter – Enhanced Setup

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?logo=prettier&logoColor=white)](https://prettier.io/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN%2FUI-0EA5E9?logo=tailwind-css&logoColor=white)](https://ui.shadcn.com/)

A minimal yet powerful [Next.js](https://nextjs.org) boilerplate bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and tailored for modern UI development.

---

## ✨ Features

- 🔥 **Clean Slate Setup**

  - Removed all default boilerplate files.
  - Cleaned up `src/app/layout.tsx` and `src/app/page.tsx`.
  - Moved global styles to `src/styles/globals.css`.

- 🎨 **Styling Tools**

  - Tailwind CSS (default)
  - Prettier + `prettier-plugin-tailwindcss` for consistent, ordered classes.
    ```bash
    npm install -D prettier prettier-plugin-tailwindcss
    ```
    `.prettierrc` config:
    ```json
    {
      "plugins": ["prettier-plugin-tailwindcss"]
    }
    ```

- 🧹 **Linting Improvements**

  - Custom ESLint rule to avoid issues with apostrophes during deployment (e.g. Vercel):
    ```js
    const eslintConfig = [
      ...compat.extends("next/core-web-vitals", "next/typescript"),
      {
        rules: {
          "react/no-unescaped-entities": "off",
        },
      },
    ];
    ```

- 🖼️ **Asset Management**

  - Cleaned up default images in `/public`.
  - Added custom assets and favicon.

- 🧩 **UI Toolkit**
  - Integrated `shadcn/ui` for beautiful, accessible components:
    ```bash
    npx shadcn@latest init
    ```
  - Added support for **Dark Mode**:
    ```bash
    npm install next-themes
    ```

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
```

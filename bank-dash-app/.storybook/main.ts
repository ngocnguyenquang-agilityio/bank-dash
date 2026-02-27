import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/nextjs",
  staticDirs: ["..\\public"],
  webpackFinal: async (config) => {
    // Replace the Node.js-dependent Effect runtime with a browser-safe mock
    // so that stories importing server actions don't pull in node:* modules.
    if (config.resolve) {
      const clerkMock = path.resolve(__dirname, "mocks/clerk-nextjs.ts");
      config.resolve.alias = {
        ...config.resolve.alias,
        [path.resolve(__dirname, "../src/lib/effect/runtime")]: path.resolve(
          __dirname,
          "mocks/effect-runtime.ts"
        ),
        "@clerk/nextjs/server": clerkMock,
        "@clerk/nextjs": clerkMock,
      };
    }
    return config;
  },
};
export default config;

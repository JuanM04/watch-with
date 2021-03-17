/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-postcss",
  ],
  alias: {
    "@components": "./src/components",
    "@utils": "./utils",
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: "/.*", dest: "/index.html" },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    minify: true,
    treeshake: true,
    target: "es2017",
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: "none",
  },
  buildOptions: {
    /* ... */
  },
};

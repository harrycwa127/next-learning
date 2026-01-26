const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tailwindcss = require("eslint-plugin-tailwindcss");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends(
        "eason",
        "next/core-web-vitals",
        "plugin:tailwindcss/recommended",
        "plugin:prettier/recommended",
    ),

    plugins: {
        tailwindcss,
    },

    rules: {
        "jsx-a11y/anchor-is-valid": ["error", {
            components: ["Link"],
            specialLink: ["hrefLeft", "hrefRight"],
            aspects: ["invalidHref", "preferButton"],
        }],

        "tailwindcss/classnames-order": "off",
    },

    settings: {
        "import/resolver": {
            alias: {
                map: [["@", "./src"]],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },

        "import/ignore": ["contentLayerAdapter.js"],
    },
}, {
    files: ["**/*.{ts,tsx}"],
    extends: compat.extends("eason/typescript", "plugin:prettier/recommended"),
}, globalIgnores([
    "node_modules",
    ".pnp",
    "**/.pnp.js",
    "coverage",
    ".next/",
    "out/",
    "build",
    "**/.DS_Store",
    "**/*.pem",
    "**/npm-debug.log*",
    "**/yarn-debug.log*",
    "**/yarn-error.log*",
    "**/.pnpm-debug.log*",
    "**/.env*.local",
    "**/.vercel",
    "**/*.tsbuildinfo",
    "**/next-env.d.ts",
    "**/.contentlayer",
    "**/contentLayerAdapter.js",
    "public/robots.txt",
    "public/sitemap*.xml",
    "public/atom.xml",
    "public/feed.xml",
    "public/feed.json",
])]);

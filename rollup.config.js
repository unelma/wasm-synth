// @format
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

module.exports = [
  {
    input: "src/js/main.js",
    output: {
      dir: "public",
      format: "es",
      sourcemap: !production
    },
    plugins: [
      postcss({
        extensions: [".css"]
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      babel({
        exclude: "node_modules/**"
      }),
      resolve({ browser: true }),
      // NOTE: styled-components won't compile without this configuration of
      // commonjs: https://github.com/styled-components/styled-components/issues/1654#issuecomment-441151140
      commonjs({
        include: "node_modules/**",
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        namedExports: {
          "node_modules/react/index.js": [
            "cloneElement",
            "createContext",
            "Component",
            "createElement"
          ],
          "node_modules/react-dom/index.js": ["render", "hydrate"],
          "node_modules/react-is/index.js": [
            "isElement",
            "isValidElementType",
            "ForwardRef"
          ]
        }
      }),
      production && terser()
    ]
  }
];

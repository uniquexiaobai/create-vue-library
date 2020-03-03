import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";
import vue from "rollup-plugin-vue";
import filesize from "rollup-plugin-filesize";
// import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

export default () => {
  return [
    // {
    //   input: "src/index.js",
    //   output: {
    //     file: "dist/index.esm.js",
    //     format: "esm",
    //     sourcemap: true,
    //   },
    // },
    {
      input: "src/index.js",
      output: {
        file: "dist/index.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
        banner: "/* my-library version " + pkg.version + " */",
        footer: "/* follow me on Twitter! @uniquexiaobai */"
      },
      plugins: [
        resolve({ extensions: [".js", ".json", ".vue"] }),
        commonjs(),
        babel({
          exclude: "node_modules/**",
          externalHelpers: true
        }),
        vue({ compileTemplate: true, css: true }),
        json(),
        filesize()
        // uglify()
      ],
      watch: {
        include: "src/**"
      }
      // external: ["vue"],
    }
  ];
};

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import vue from "rollup-plugin-vue";

export default () => {
  return [
    {
      input: "src/index.js",
      output: {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        name: "abc"
      },
      plugins: [resolve({ extensions: [".vue"] }), commonjs(), babel(), vue()]
    },
    {
      input: "src/index.js",
      output: {
        file: "dist/index.js",
        format: "umd",
        exports: "named",
        sourcemap: true,
        name: "abc"
      },
      plugins: [resolve({ extensions: [".vue"] }), commonjs(), babel(), vue()]
    }
  ];
};

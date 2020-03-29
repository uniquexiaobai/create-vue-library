import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const capitalize = str => {
	return str[0].toUpperCase() + str.slice(1);
};

// const projectName = "{{ name }}";
const projectName = 'my-comp';

const input = 'src/index.js';
const getPlugins = target => {
	const plugins = [
		resolve({ extensions: ['.js', '.ts', '.vue'] }),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
			externalHelpers: true,
		}),
		typescript({
			experimentalDecorators: true,
			module: 'es2015',
		}),
		vue({
			css: true,
			template: {
				isProduction: true,
				optimizeSSR: target === 'cjs',
			},
		}),
		json(),
		filesize(),
		alias({
			'@': './src',
		}),
		replace({
			__VERSION__: pkg.version,
		}),
		// eslint(),
	];

	return plugins;
};
const external = ['vue'];
const banner = '/* library version ' + pkg.version + ' */';
const footer = '/* follow me on Twitter! @uniquexiaobai */';

export default () => {
	return [
		{
			input,
			output: {
				file: 'dist/index.esm.js',
				format: 'esm',
				sourcemap: true,
				banner,
				footer,
			},
			plugins: getPlugins('esm'),
			external,
		},
		{
			input,
			output: {
				file: `dist/index.js`,
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
				globals: { vue: 'Vue' },
				banner,
				footer,
			},
			plugins: getPlugins('cjs'),
			external,
		},
		{
			input,
			output: {
				file: `dist/${projectName}.js`,
				name: capitalize(projectName),
				name: 'Comp',
				format: 'umd',
				exports: 'named',
				sourcemap: true,
				globals: { vue: 'Vue' },
				banner,
				footer,
			},
			plugins: getPlugins(),
			external,
		},
		{
			input,
			output: {
				file: `dist/${projectName}.min.js`,
				name: capitalize(projectName),
				format: 'umd',
				exports: 'named',
				sourcemap: true,
				globals: { vue: 'Vue' },
				banner,
				footer,
			},
			plugins: [...getPlugins(), terser()],
			external,
		},
	];
};

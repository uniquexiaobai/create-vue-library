import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ncp from 'ncp';
import { promisify } from 'util';

export const logError = message =>
	console.error(chalk`{red ERROR:} ${message}`);

export const access = promisify(fs.access);
export const stat = promisify(fs.stat);
export const copy = promisify(ncp);
export const mkdir = promisify(fs.mkdir);

export const isDir = name =>
	access(name)
		.then(stats => stats.isDirectory())
		.catch(() => false);

export const isFile = name =>
	access(name)
		.then(stats => stats.isFile())
		.catch(() => false);

export const isFileOrDirExists = name =>
	stat(name)
		.then(() => true)
		.catch(() => false);

export const getAbsolutePath = (...paths) => {
	return path.resolve(process.cwd(), ...paths);
};

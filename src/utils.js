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
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

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

export const readFileJson = async dir => {
  try {
    const file = await readFile(dir, 'utf8');
    return JSON.parse(file);
  } catch (err) {
    return;
  }
};

export const writeFileJson = async (dir, data) => {
  try {
    await writeFile(dir, JSON.stringify(data, null, '  '), 'utf8');
  } catch (err) {
    return;
  }
};

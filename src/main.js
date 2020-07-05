import path from 'path';
import util from 'util';
import fs from 'fs';
import execa from 'execa';
import listr from 'listr';
import chalk from 'chalk';
import { projectInstall } from 'pkg-install';
import {
  logError,
  mkdir,
  copy,
  access,
  getAbsolutePath,
  readFileJson,
  writeFileJson,
} from './utils';
import Listr from 'listr';

async function createProjectDirectory(options) {
  try {
    await mkdir(options.projectDirectory);
  } catch (err) {
    return Promise.reject(new Error('Failed to initialize project directory'));
  }
}

async function copyTemplateFiles(options) {
  try {
    await copy(options.templateDirectory, options.projectDirectory);
  } catch (err) {
    return Promise.reject(new Error('Failed to copy template files'));
  }
}

async function initPackageInfo(options) {
  const packageDirectory = getAbsolutePath(
    options.projectDirectory,
    './package.json'
  );

  try {
    const initialInfo = await readFileJson(packageDirectory);
    const username = await getGithubUsername();
    const info = Object.assign(initialInfo, {
      name: options.projectName,
      author: username,
      repository: `https://github.com/${username}/${options.projectName}`,
    });

    await writeFileJson(packageDirectory, info);
  } catch (err) {
    return Promise.reject(new Error('Failed to init package.json'));
  }
}

async function getGithubUsername() {
  const { stdout } = await execa('git', ['config', 'user.name']);

  return stdout;
}

async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.projectDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

export async function createProject(options) {
  if (options.template === 'storybook' || options.template === 'typescript') {
    console.log('Coming soon.');
    process.exit(0);
  }

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  // console.log('Options:', options);

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    logError('Invalid template name');
    process.exit(1);
  }

  const tasks = new listr([
    {
      title: 'Initialize project',
      task: () =>
        new Listr([
          {
            title: 'Create project directory',
            task: () => createProjectDirectory(options),
          },
          {
            title: 'Copy Template files',
            task: () => copyTemplateFiles(options),
          },
          {
            title: 'Initialize package.json',
            task: () => initPackageInfo(options),
          },
          { title: 'Initialize git', task: () => initGit(options) },
        ]),
    },
    {
      title: 'Install dependencies',
      task: () => projectInstall({ cwd: options.projectDirectory }),
    },
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.blue.bold('Project ready'));
    })
    .catch(err => {
      console.log('task run error', err);
    });
}

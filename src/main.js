import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import execa from 'execa';
import listr from 'listr';
import chalk from 'chalk';
import ncp from 'ncp';
import { projectInstall } from 'pkg-install';
import { logError } from './utils';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
	return copy(options.templateDirectory, options.targetDirectory, {
		clobber: false,
	});
}

async function initGit(options) {
	const result = await execa('git', ['init'], {
		cwd: options.targetDirectory,
	});
	if (result.failed) {
		return Promise.reject(new Error('Failed to initialize git'));
	}
	return;
}

export async function createProject(options) {
  // ! mkdir options.projectName

	options = {
		...options,
		targetDirectory: options.targetDirectory || process.cwd(),
	};

	const currentFileUrl = import.meta.url;
	const templateDir = path.resolve(
		new URL(currentFileUrl).pathname,
		'../../templates',
		options.template.toLowerCase()
	);
	options.templateDirectory = templateDir;

	console.log('Options:', options);

	try {
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		logError('Invalid template name');
		process.exit(1);
	}

	const tasks = new listr([
		{
			title: 'Copy project files',
			task: () => copyTemplateFiles(options),
		},
		{
			title: 'Initialize git',
			task: () => initGit(options),
		},
		{
			title: 'Install dependencies',
			task: () => projectInstall({ cwd: options.targetDirectory }),
		},
	]);

	await tasks.run();

	console.log('%s Project ready', chalk.green.bold('DONE'));
	return true;
}

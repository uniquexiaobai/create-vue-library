import path from 'path';
import fs from 'fs';
import execa from 'execa';
import listr from 'listr';
import chalk from 'chalk';
import { projectInstall } from 'pkg-install';
import { logError, mkdir, copy, access } from './utils';

async function createProjectDirectory(options) {
	try {
		await mkdir(options.projectDirectory);
	} catch (err) {
		return Promise.reject(new Error('Failed to initialize project directory'));
	}
	return;
}

async function copyTemplateFiles(options) {
	return copy(options.templateDirectory, options.projectDirectory, {
		clobber: false,
	});
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
			title: 'Initialize project directory',
			task: () => createProjectDirectory(options),
		},
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
			task: () => projectInstall({ cwd: options.projectDirectory }),
		},
	]);

	await tasks.run();

	console.log('%s Project ready', chalk.green.bold('DONE'));
	return true;
}

import arg from 'arg';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import { logError } from './utils';
import { createProject } from './main';
import pkg from '../package';

const getHelp = () => chalk`
{bold Usage:}

    create-vue-library {cyan <project-directory>} [options]

{bold Options:}

    -h, --help                          output usage information

    -v, --version                       output the version number

    -t, --template                      specify a template for the created project

    By default, create-vue-library will use basic template

  If you have any problems, do not hesitate to file an issue: 
  {cyan https://github.com/uniquexiaobai/create-vue-library/issues/new}
`;

function parseArgsIntoOptions(rowArgs) {
	let args;

	if (!rowArgs[2]) {
		console.error('Please specify the project directory:');
		console.log(
			`  ${chalk.cyan('create-vue-library')} ${chalk.green(
				'<project-directory>'
			)}`
		);
		console.log();
		console.log('For example:');
		console.log(
			`  ${chalk.cyan('create-vue-library')} ${chalk.green('my-vue-library')}`
		);
		console.log();
		console.log(
			`Run ${chalk.cyan(`${'create-vue-library'} --help`)} to see all options.`
		);
		process.exit(1);
	}

	try {
		args = arg(
			{
				'--help': Boolean,
				'--version': Boolean,
				'--template': String,

				'-h': '--help',
				'-v': '--version',
				'-t': '--template',
			},
			{
				argv: rowArgs.slice(2),
			}
		);
	} catch (err) {
		logError(err.message);
		process.exit(1);
	}

	if (args['--version']) {
		console.log(pkg.version);
		process.exit(0);
	}

	if (args['--help']) {
		console.log(getHelp());
		process.exit(0);
	}

	return {
		projectName: rowArgs[2],
		template: args['--template'],
	};
}

async function proptForMissingOptions(options) {
	const defaultTemplate = 'basic';

	const questions = [];
	if (!options.template) {
		questions.push({
			type: 'list',
			name: 'template',
			message: 'Please choose which project template to use',
			choices: ['basic', 'typescript', 'storybook'],
			default: defaultTemplate,
		});
	}

	const answers = await prompt(questions);
	return {
		...options,
		template: options.template || answers.template,
	};
}

export async function cli(rowArgs) {
	let options = parseArgsIntoOptions(rowArgs);
	options = await proptForMissingOptions(options);
	await createProject(options);
}

import chalk from 'chalk';

export const logError = message =>
	console.error(chalk`{red ERROR:} ${message}`);

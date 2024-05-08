#!/usr/bin/env node
import path from 'node:path';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import generateFiles from './generateFiles.js';

function printIntroText() {
  console.log(
    chalk.yellow(
      figlet.textSync('Generate Component', {
        horizontalLayout: 'full',
      })
    )
  );

  console.log(
    'You can enter a ' + chalk.bold('name') + " for a new component. e.g. '" + chalk.green('Related Topics') + "'."
  );
  console.log('All necessary files whit some boilerplate code and their imports will then be generated.');
  console.log('e.g.');
  console.log('typescript file: ', chalk.cyan(`related-topics.ts`));
  console.log('scss file: ', chalk.cyan(`related-topics.scss`));
  console.log('\nYou can press ', chalk.bgWhite.black(' ctrl + c '), ' any time to cancel the process.\n\n');
}

// returns user config with prompts and file generators will fallback to module config.js
async function getConfig(configPath) {
  let config;

  try {
    config = await import(path.resolve(configPath));
  } catch (error) {
    // user did not provide a custom config, use the default one
    // there was some error in the user's config file
    if (!error.message.startsWith('Cannot find module')) throw error;
    config = await import('./config.js');
  }

  return config;
}

/**
 * asks the user information regarding the necessary files for the new component
 *
 * @param {GenerateComponent.CliOptions} cliOptions - enquiry options
 * @returns {Promise<Object>} - info which user has filled in.
 */
async function enquiry(prompts, cliOptions = {}) {
  const answers = await inquirer.prompt(prompts, cliOptions);
  return answers;
}

export async function createNewComponent(cliOptions) {
  printIntroText();

  if (cliOptions.name) console.log(chalk.green('?'), 'Component Name?', chalk.cyan(cliOptions.name));

  const config = await getConfig(cliOptions.config);
  const prompts = config.default.map((item) => item.prompt).filter((prompt) => prompt !== undefined);
  const options = await enquiry(prompts, { ...cliOptions });

  if (cliOptions.verbose) console.log('Filled in data: ', options);

  await generateFiles(options, config.default, true);

  process.exit = 0;
}
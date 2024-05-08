#!/usr/bin/env node
import { cloneRepo } from './boilerplateGenerator/index.js';
import { createNewComponent } from './componentGenerator/index.js';
import { program, Option } from 'commander';

const DEFAULT_CREATE_COMPONENT_CONFIG = './componentGenerator/config.js';

program
  .command('clone')
  .argument('<folderName>', 'new folder name')
  .description('clone a template repository into a new folder')
  .action(cloneRepo);
  
program
  .command('new')
  .description('create new component/block')
  .addOption(
    new Option(
      '-N, --name [component name]',
      "component name, incase you don't want to answer it in the cli interaction"
    ).argParser((name) => name.toLowerCase().trim())
  )
  .option('-C, --config [config]', 'relative path to the optional config file.', DEFAULT_CREATE_COMPONENT_CONFIG)
  .option(
    '--templatesDir [templatesDir]',
    "relative path to the directory where default templates are overwritten. If non passed 'componentGenerator/templates' will be checked"
  )
  .option('--verbose', 'logs debug information')
  .action((cliOptions) => {
    createNewComponent(cliOptions)
  });

program
  .parse(process.argv);
#!/usr/bin/env node

import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';

const XWALK_TYPE = 'x-walk';
const DOC_BASED_TYPE = 'doc-based';


console.log(
  chalk.yellow(
    figlet.textSync('Create EDS App', {
      horizontalLayout: 'full',
    })
  )
);

const projectType = await select({ 
  message: 'Which project template would you like to generate?', 
  choices: [{
    name: 'X-Walk',
    value: XWALK_TYPE,
    description: 'Generate the boilerplate with AEMaaCS and Universaleditor as content source',
  },
  {
    name: 'Doc-Based',
    value: DOC_BASED_TYPE,
    description: 'Generate the boilerplate with Google drive or SharePoint as content source',
  },]
});

if (projectType === XWALK_TYPE) {
  const projectName = await input({ message: 'Enter the project name' });
  const contentSourceURL = await input(
    { 
      message: 'Enter the Author AEMaaCS URL https://author-pXXXXXX-XXXXX.adobeaemcloud.com/ or just press enter to skip',
    });
  console.log('Generating X-Walk project ' + projectName);
}

if (projectType === DOC_BASED_TYPE) {
  const projectName = await input({ message: 'Enter the project name' });
  const contentSourceURL = await input(
    { 
      message: 'The Google Drive or SharePoint URL https://drive.google.com/drive/XXX/XXX/folders/XXXXXX or just press enter to skip', 
    });

  console.log('Generating Doc-Based project' + projectName);
}

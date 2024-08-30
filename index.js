#!/usr/bin/env node

import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from "node:fs";
import path from "node:path";

const XWALK_TYPE = 'x-walk';
const DOC_BASED_TYPE = 'doc-based';


console.log(
  chalk.yellow(
    figlet.textSync('Create EDS App', {
      horizontalLayout: 'full',
    })
  )
);

const generateProject = async ({projectName, projectType, contentSourceURL}) => {
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`The project ${projectName} already exists in the current directory`));
    return;
  }

  fs.mkdirSync(projectPath);
  
  fs.cpSync("./src/shared/", projectPath, { recursive: true });

  if (projectType === XWALK_TYPE) {
    fs.cpSync("./src/x-walk/", projectPath, { recursive: true }); // force is needed to overwrite the existing files

  }

  if (projectType === DOC_BASED_TYPE) {
    fs.cpSync("./src/doc-based/", projectPath, { recursive: true }); // force is needed to overwrite the existing files
  }
};

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

  generateProject({projectName, projectType, contentSourceURL});
}

if (projectType === DOC_BASED_TYPE) {
  const projectName = await input({ message: 'Enter the project name' });
  const contentSourceURL = await input(
    { 
      message: 'The Google Drive or SharePoint URL https://drive.google.com/drive/XXX/XXX/folders/XXXXXX or just press enter to skip', 
    });

  console.log('Generating Doc-Based project' + projectName);

  generateProject({projectName, projectType, contentSourceURL});
}

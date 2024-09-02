#!/usr/bin/env node

import { select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from "node:fs";
import path from "node:path";
import nunjucks from "nunjucks";
import NodeBuffer from "node:buffer";


const XWALK_TYPE = 'x-walk';
const DOC_BASED_TYPE = 'doc-based';


console.log(
  chalk.yellow(
    figlet.textSync('Create EDS App', {
      horizontalLayout: 'full',
    })
  )
);

nunjucks.configure({ autoescape: false });

const generateProject = async ({sourceDir, outputDir, projectName, contentSourceURL, shouldAskToOverwriteProject = true}) => {
  if (shouldAskToOverwriteProject) {
    if (fs.existsSync(outputDir)) {
      console.log(chalk.red(`Project directory already exists at ${outputDir}\n`));  
      let overwriteProject = await confirm({ message: 'Do you want to overwrite the existing project?\n', initial: false });
      if (!overwriteProject) {
        console.log(chalk.yellow('Exiting...'));
        process.exit(0);
      }
    }
  }

  // fs.mkdirSync(projectPath);

  // nunjucks.configure(projectPath, { autoescape: false });
  
  // fs.cpSync("./src/shared/", projectPath, { recursive: true });

  // if (projectType === XWALK_TYPE) {
  //   fs.cpSync("./src/x-walk/", projectPath, { recursive: true, force: true }); // force is needed to overwrite the existing files
  // }

  // if (projectType === DOC_BASED_TYPE) {
  //   fs.cpSync("./src/doc-based/", projectPath, { recursive: true, force: true }); // force is needed to overwrite the existing files
  // }


  // if (!fs.existsSync(outputDir)) {
  //   fs.mkdirSync(outputDir, { recursive: true });
  // }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  

  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(outputDir, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      generateProject({sourceDir: sourcePath, outputDir: destPath, projectName, contentSourceURL, shouldAskToOverwriteProject: false});
    } else if (stat.isFile()) {
      let fileContent = fs.readFileSync(sourcePath, 'utf8');
      
      // Render the file content using Nunjucks if it is a utf-8 file
      if (NodeBuffer.isUtf8(fileContent)) {
        try {
  
          fileContent = nunjucks.renderString(fileContent, { projectName, contentSourceURL });
        } catch (error) {
          console.error(`Error rendering template for file: ${sourcePath}`);
          console.error(error.message);
          console.log(chalk.yellow(`Template content after rendering: ${fileContent}`));
  
          throw error;
        }
      }

      
      fs.writeFileSync(destPath, fileContent);
    }
  });
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

const projectName = await input({ message: 'Enter the project name' });

if (projectType === XWALK_TYPE) {
  const contentSourceURL = await input(
    { 
      message: 'Enter the Author AEMaaCS URL https://author-pXXXXXX-XXXXX.adobeaemcloud.com/ or just press enter to skip',
    });

  console.log('Generating X-Walk project ' + projectName);
  const outputDir = path.resolve(projectName);
  const sourceDir = path.resolve('./src/shared');


  generateProject({sourceDir, outputDir, projectName, contentSourceURL});
}

if (projectType === DOC_BASED_TYPE) {
  const contentSourceURL = await input(
    { 
      message: 'The Google Drive or SharePoint URL https://drive.google.com/drive/XXX/XXX/folders/XXXXXX or just press enter to skip', 
    });

  console.log('Generating Doc-Based project' + projectName);

  generateProject({projectName, projectType, contentSourceURL});
}

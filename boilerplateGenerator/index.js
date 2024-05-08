#!/usr/bin/env node
import { execSync } from 'child_process';

export function cloneRepo() {
  try {
    const folderName = process.argv.slice(3);
    if (folderName.length === 0) {
      throw new Error('Please enter a valid folder name.');
    }

    const templateRepo = 'diva-e/eds-boilerplate';
    execSync(`git clone https://github.com/${templateRepo}.git '${folderName}'`);
    console.log(`Template repository cloned into ${folderName} folder.`);
  } catch (error) {
    console.error('Error cloning template repository:', error);
  }
}
#!/usr/bin/env node
import path from "node:path";
import fs from "fs-extra";
import chalk from 'chalk';
import figlet from 'figlet';
import { program } from "commander";
import { simpleGit } from "simple-git";
import deepmerge from "deepmerge";
import { projectInstall } from "pkg-install";

const EDS_BOILERPLATE_REPO = "https://github.com/diva-e/eds-boilerplate.git";

console.log(
  chalk.yellow(
    figlet.textSync('Initialize EDS Project', {
      horizontalLayout: 'full',
    })
  )
);

let folderName = ".";
program
  .argument("[folderName]", "new folder name")
  .description("clone a template repository into a new folder")
  .action((name) => {
    if (name) folderName = name;
  })
  .parse(process.argv);

const projectDir = path.join(process.cwd(), folderName);
const gitCloneDir = path.join(projectDir, "eds-clone");

(async () => {
  console.log("Download boilerplate repo ...");
  // make sure there isn't any old stuff in the folder
  await fs.remove(gitCloneDir);
  // create the target directory which will be used when the git repo is initialized
  await fs.ensureDir(projectDir);

  const git = simpleGit({ baseDir: projectDir });
  await git.clone(EDS_BOILERPLATE_REPO, gitCloneDir, { "--depth": 1 });

  console.log("Copy files ...");
  await fs.copy(gitCloneDir, projectDir, {
    filter(src, _dest) {
      return (
        !src.endsWith(".git") && src !== path.join(gitCloneDir, "package.json")
      );
    },
  });
  // initialize as a git repo, which is a requirement to be able to install the git pre-commit hooks by husky
  await git.init();

  // prepare package.json
  const projectPkgJsonPath = path.join(projectDir, "package.json");
  const projectPkg = (await fs.pathExists(projectPkgJsonPath))
    ? await fs.readJson(projectPkgJsonPath)
    : {};
  const boilerplatePkg = await fs.readJson(
    path.join(gitCloneDir, "package.json")
  );
  // update package.jsons, in case user had already an existing package.json, it will have priority over the one from the boilerplate repo
  const pkg = deepmerge.all([
    boilerplatePkg,
    {
      // use the dir name as default package name, similar to the `npm init --yes` behavior.
      name: path.basename(projectDir),
      version: "1.0.0",
    },
    projectPkg,
  ]);
  // store the updated package.json
  await fs.writeJson(projectPkgJsonPath, pkg, { spaces: "  " });

  // remove the directory where the git cloned the boilerplate repo
  await fs.remove(gitCloneDir);

  console.log("Install dependencies ...\n");
  // npm install
  await projectInstall({
    cwd: projectDir,
    prefer: "npm",
    stdio: ["pipe", process.stdout, process.stderr],
  });

  console.log(chalk.green("\nDone!"));
  console.warn(
    chalk.yellow("Remember to update the Google Drive Url in "),
    path.join(projectDir, "fstab.yaml")
  );
})();

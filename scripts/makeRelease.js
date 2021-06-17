/* eslint-disable prettier/prettier */
const del = require('del');
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const glob = require('glob-promise');
const copy = require('recursive-copy');
const cpy = require('cpy');

const distPath = './dist';
const releasePath = './release';
const sourcePath = './src';

(async () => {
  (await deleteReleaseDir()) &&
  (await copyDistFiles()) &&
  (await fixSourceMapPaths()) &&
  // (await copySourceFiles()) &&
  (await copyPackageFiles()) &&
  (await patchPackageJson());
})();

async function deleteReleaseDir() {
  const deleteReleaseDirSpinner = ora('Deleting release directory');

  try {
    deleteReleaseDirSpinner.start();
    const deleted = await del([`${releasePath}/**/*`, `!${releasePath}`]);
    deleteReleaseDirSpinner.text += ` (deleted ${deleted.length} files/dirs)`;
    deleteReleaseDirSpinner.succeed();
    return true;
  } catch (error) {
    deleteReleaseDirSpinner.text = `${chalk.red(
      'Fail to delete release directory'
    )}: ${error.message}`;
    deleteReleaseDirSpinner.fail();
    return false;
  }
}

async function copyDistFiles() {
  const copyDistFilesSpinner = ora('Copying dist files for release');

  try {
    copyDistFilesSpinner.start();
    await copy(distPath, releasePath);
    copyDistFilesSpinner.succeed();
    return true;
  } catch (error) {
    copyDistFilesSpinner.text = `${chalk.red(
      'Fail to copy dist directory to release'
    )}: ${error.message}`;
    copyDistFilesSpinner.fail();
    return false;
  }
}

async function fixSourceMapPaths() {
  const fixSourceMapsSpinner = ora('Fixing source maps paths');

  try {
    fixSourceMapsSpinner.start();
    const sourceMaps = await glob(`${releasePath}/**/*.js.map`);
    fixSourceMapsSpinner.succeed();

    let fixedFiles = 0;

    for (const file of sourceMaps) {
      const json = fs.readFileSync(file, { encoding: 'utf-8' });
      const data = JSON.parse(json);

      if (data && data.sources && data.sources.length > 0) {
        data.sources = data.sources.map(source => source.replace(/.*\/src/, './src'));
        fs.writeFileSync(file, JSON.stringify(data), { encoding: 'utf-8' });
        fixedFiles++;
      }
    }

    fixSourceMapsSpinner.text += ` (fixed ${fixedFiles} files)`;
    fixSourceMapsSpinner.succeed();
    return true;
  } catch (error) {
    fixSourceMapsSpinner.text = `${chalk.red(
      'Fail to fix source maps paths'
    )}: ${error.message}`;
    fixSourceMapsSpinner.fail();
    return false;
  }
}

// eslint-disable-next-line no-unused-vars
async function copySourceFiles() {
  const copySrcFilesSpinner = ora('Copying source files for release');

  try {
    copySrcFilesSpinner.start();
    const srcDest = `${releasePath}/src`;
    fs.mkdirSync(srcDest);
    await copy(sourcePath, srcDest);
    copySrcFilesSpinner.succeed();
    return true;
  } catch (error) {
    copySrcFilesSpinner.text = `${chalk.red(
      'Fail to copy source files to release'
    )}: ${error.message}`;
    copySrcFilesSpinner.fail();
    return false;
  }
}

async function copyPackageFiles() {
  const copyPkgFilesSpinner = ora('Copying package files for release');

  try {
    copyPkgFilesSpinner.start();

    await cpy([
      'package.json',
      'LICENSE',
      'README.md'
    ], releasePath);

    copyPkgFilesSpinner.succeed();
    return true;
  } catch (error) {
    copyPkgFilesSpinner.text = `${chalk.red(
      'Fail to copy package files to release'
    )}: ${error.message}`;
    copyPkgFilesSpinner.fail();
    return false;
  }
}

async function patchPackageJson() {
  const patchPkgJsonSpinner = ora('Patching package.json for release');

  try {
    patchPkgJsonSpinner.start();
    const file = `${releasePath}/package.json`;
    const json = fs.readFileSync(`${releasePath}/package.json`, { encoding: 'utf-8' });
    const data = JSON.parse(json);

    delete data.files;
    delete data.scripts.postinstall;
    delete data.prettier;
    delete data.husky;
    delete data.config;
    delete data.devDependencies;
    delete data['size-limit'];

    for (const name in data.scripts) {
      if (/^--/.test(name)) {
        delete data.scripts[name];
      }
    }

    fs.writeFileSync(file, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
    patchPkgJsonSpinner.succeed();
    return true;
  } catch (error) {
    patchPkgJsonSpinner.text = `${chalk.red(
      'Fail to patch package.json for release'
    )}: ${error.message}`;
    patchPkgJsonSpinner.fail();
    return false;
  }
}

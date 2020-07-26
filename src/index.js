/**
 * Write an application/script that when executed in a directory,
 * produces a list of all files (using their absolute paths) containing the keyword "TODO" in them.
 * The files can be in the immediate directory, or a sub-directory (or a sub-directory of the sub-directory,
 * ad infinitum).
 */

// Command to run this script: node src/index.js

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

const readDirectory = async (path) => readdir(path);

const isDirectory = async (path) => (await lstat(path)).isDirectory();

const containsTodo = async (path) => {
  const data = await readfile(path, { encoding: 'utf8' });
  return data.indexOf('TODO') !== -1;
};

/**
 * Visits all items in current directory and all sub-directories,
 * Add item path to result if it contains 'TODO'
 * @param {string} currPath
 * @param @return {string []} result List of paths to be returned
 */
const checkForTodo = async (currPath, result) => {
  const items = await readDirectory(currPath);

  for (const item of items) {
    const itemPath = path.join(currPath, item);

    // Do not process this file
    if (itemPath === __filename) continue;

    if (await isDirectory(itemPath)) {
      await checkForTodo(itemPath, result);
    } else {
      if (await containsTodo(itemPath)) {
        result.push(itemPath);
      }
    }
  }

  return result;
};

const main = async (path = __dirname) => {
  const res = await checkForTodo(path, []);
  console.log(res);
};

if (require.main === module) {
  main();
}

module.exports = {
  readDirectory,
  isDirectory,
  containsTodo,
  checkForTodo,
};

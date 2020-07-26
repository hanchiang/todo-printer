const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const { expect } = require('chai');

const {
  readDirectory,
  isDirectory,
  containsTodo,
  checkForTodo,
} = require('../src/index.js');

describe('Tests', () => {
  it('Should report readDirectory() correctly', async () => {
    const items = await readDirectory(__dirname);
    const expected = {
      level1: true,
      'index.js': true,
      'with-todo.js': true,
      'without-todo.js': true,
      'without-todo2.js': true,
    };
    expect(items.length).to.equal(Object.keys(expected).length);
    for (const item of items) {
      expect(expected[item]).to.equal(true);
    }
  });

  it('should report isDirectory() correctly', async () => {
    const testItems = [
      { path: path.join(__dirname, 'without-todo.js'), expected: false },
      { path: path.join(__dirname, 'level1'), expected: true },
    ];

    for (const testItem of testItems) {
      const res = await isDirectory(testItem.path);
      expect(res).to.equal(testItem.expected);
    }
  });

  it('should report containsTodo() correctly', async () => {
    const testItems = [
      { path: path.join(__dirname, 'without-todo.js'), expected: false },
      { path: path.join(__dirname, 'with-todo.js'), expected: true },
      { path: path.join(__dirname, 'without-todo2.js'), expected: false },
    ];

    for (const testItem of testItems) {
      const res = await containsTodo(testItem.path);
      expect(res).to.equal(testItem.expected);
    }
  });

  it('should report checkForTodo() correctly', async () => {
    const expected = {
      [path.join(__dirname, 'with-todo.js')]: true,
      [path.join(__dirname, 'level1', 'l1-with-todo.js')]: true,
      [path.join(__dirname, 'level1', 'level2', 'l2-with-todo.js')]: true,
    };

    let res = await checkForTodo(__dirname, []);
    for (const item of res) {
      expect(expected[item]).to.equal(true);
    }

    // empty result when script is run at src/
    res = await checkForTodo(path.join(__dirname, '..', 'src'), []);
    expect(res.length).to.equal(0);
  });
});

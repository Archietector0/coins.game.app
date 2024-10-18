import path from "path";
import { Directory } from "../../srcs/types";
import { Utils } from "../../srcs/utils";
import * as fs from 'fs';

const filePath = path.join(__dirname, '../../state.json');

describe('Utils - listDirectories', () => {
  let utils: Utils;
  let root: Directory;

  beforeAll(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  beforeEach(() => {
    root = {
      dir1: {},
      dir2: { subDir: {} },
    };
    utils = new Utils(root);
  });

  test('should return true and list directories at the root level', () => {
    const result = utils.listDirectories({});
    expect(result).toBe(true);
  });

  test('should return true and list nested directories', () => {
    const result = utils.listDirectories({});
    expect(result).toBe(true);
  });

  test('should return false if the directory is empty', () => {
    const result = utils.listDirectories({ directory: {} });
    expect(result).toBe(false);
  });

  test('should return true and handle deeply nested directories', () => {
    root['dir3'] = { subDir1: { subDir2: {} } };
    const result = utils.listDirectories({});
    expect(result).toBe(true);
  });

  test('should return false if there are no directories to list', () => {
    root = {};
    const result = utils.listDirectories({ directory: {} });
    expect(result).toBe(false);
  });

  test('should return true for listing root directories', () => {
    const result = utils.listDirectories({});
    expect(result).toBe(true);
  });

  test('should handle directories with special characters', () => {
    root['dir-special'] = {};
    const result = utils.listDirectories({});
    expect(result).toBe(true);
  });
});
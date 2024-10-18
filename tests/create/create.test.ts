import path from "path";
import { Directory } from "../../srcs/types";
import { Utils } from "../../srcs/utils";
import * as fs from 'fs';

const filePath = path.join(__dirname, '../../state.json');

describe('Utils - createDirectory', () => {
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
    root = {};
    utils = new Utils(root);
  });

  test('should create a valid directory', () => {
    const result = utils.createDirectory({ path: 'validDir' });
    expect(result).toBe(true);
    expect(root.validDir).toBeDefined();
  });

  test('should create nested directories', () => {
    const result = utils.createDirectory({ path: 'parent/child' });
    expect(result).toBe(true);
    expect(root.parent.child).toBeDefined();
  });

  test('should not create a directory with invalid characters', () => {
    const result = utils.createDirectory({ path: 'invalid*dir' });
    expect(result).toBe(false);
  });

  test('should not create a directory with more than 11 parts', () => {
    const result = utils.createDirectory({ path: 'b1/b2/b3/b4/b5/b6/b7/b8/b9/b10/b11/b12' });
    expect(result).toBe(false);
  });

  test('should not create a directory with a part exceeding 11 characters', () => {
    const result = utils.createDirectory({ path: 'thisIsWayTooLong' });
    expect(result).toBe(false);
  });

  test('should not create a directory with only slashes', () => {
    const result = utils.createDirectory({ path: '////' });
    expect(result).toBe(false);
  });

  test('should not create a directory if already exists', () => {
    root['existingDir'] = {};
    const result = utils.createDirectory({ path: 'existingDir' });
    expect(result).toBe(false);
  });

  test('should trim leading/trailing spaces from path', () => {
    const result = utils.createDirectory({ path: '  newDir  ' });
    expect(result).toBe(true);
    expect(root.newDir).toBeDefined();
  });

  test('should return false if path is empty', () => {
    const result = utils.createDirectory({ path: '' });
    expect(result).toBe(false);
  });

  test('should return false if part starts or ends with a special character', () => {
    const result = utils.createDirectory({ path: '.hiddenDir' });
    expect(result).toBe(false);
  });
});
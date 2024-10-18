import { Utils } from '../../srcs/utils';
import { Directory } from '../../srcs/types';

describe('Utils - deleteDirectory', () => {
  let utils: Utils;
  let root: Directory;

  beforeEach(() => {
    root = {
      dir1: {},
      dir2: { subDir: {} },
    };
    utils = new Utils(root);
  });

  test('should delete a directory and return true', () => {
    const result = utils.deleteDirectory({ path: 'dir1' });
    expect(result).toBe(true);
    expect(root.dir1).toBeUndefined();
  });

  test('should delete a nested directory and return true', () => {
    const result = utils.deleteDirectory({ path: 'dir2/subDir' });
    expect(result).toBe(true);
    expect(root.dir2.subDir).toBeUndefined();
  });

  test('should return false if directory does not exist', () => {
    const result = utils.deleteDirectory({ path: 'nonExistent' });
    expect(result).toBe(false);
  });

  test('should return true and delete the entire root if path is "/"', () => {
    const result = utils.deleteDirectory({ path: '/' });
    expect(result).toBe(true);
    expect(Object.keys(root).length).toBe(0);
  });

  test('should return false if part of the path does not exist', () => {
    const result = utils.deleteDirectory({ path: 'dir2/nonExistent' });
    expect(result).toBe(false);
  });

  test('should not delete anything if the path is invalid', () => {
    const result = utils.deleteDirectory({ path: '' });
    expect(result).toBe(false);
  });

  test('should return false if attempting to delete non-existent nested directory', () => {
    const result = utils.deleteDirectory({ path: 'dir2/nonexistentSubDir' });
    expect(result).toBe(false);
  });

  test('should return true for deleting deeply nested directories', () => {
    root['parent'] = { child: { subChild: {} } };
    const result = utils.deleteDirectory({ path: 'parent/child/subChild' });
    expect(result).toBe(true);
    expect(root.parent.child.subChild).toBeUndefined();
  });

  test('should return false when trying to delete a directory that has already been deleted', () => {
    utils.deleteDirectory({ path: 'dir1' });
    const result = utils.deleteDirectory({ path: 'dir1' });
    expect(result).toBe(false);
  });

  test('should return false if trying to delete directory with invalid path', () => {
    const result = utils.deleteDirectory({ path: 'invalid///path' });
    expect(result).toBe(false);
  });
});
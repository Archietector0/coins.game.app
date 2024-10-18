import { Utils } from '../../srcs/utils';
import { Directory } from '../../srcs/types';

describe('Utils - moveDirectory', () => {
  let utils: Utils;
  let root: Directory;

  beforeEach(() => {
    root = {
      sourceDir: { example: {} },
      targetDir: {},
    };
    utils = new Utils(root);
  });

  test('should move a directory and return true', () => {
    const result = utils.moveDirectory({ sourcePath: 'sourceDir', targetPath: 'targetDir' });
    expect(result).toBe(true);
    expect(root.targetDir.sourceDir).toBeDefined();
    expect(root.sourceDir).toBeUndefined();
  });

  test('should return false if source directory does not exist', () => {
    const result = utils.moveDirectory({ sourcePath: 'nonExistent', targetPath: 'targetDir' });
    expect(result).toBe(false);
  });

  test('should return false if target directory does not exist', () => {
    const result = utils.moveDirectory({ sourcePath: 'sourceDir', targetPath: 'nonExistent' });
    expect(result).toBe(false);
  });

  test('should move a nested directory and return true', () => {
    root['parent'] = { child: {} };
    const result = utils.moveDirectory({ sourcePath: 'parent/child', targetPath: 'targetDir' });
    expect(result).toBe(true);
    expect(root.targetDir.child).toBeDefined();
    expect(root.parent.child).toBeUndefined();
  });

  test('should return false if directory already exists in the target', () => {
    root.targetDir['sourceDir'] = {};
    const result = utils.moveDirectory({ sourcePath: 'sourceDir', targetPath: 'targetDir' });
    expect(result).toBe(false);
  });

  test('should move directory to root and return true', () => {
    const result = utils.moveDirectory({ sourcePath: 'sourceDir/example', targetPath: '/' });
    expect(result).toBe(true);
    expect(root.sourceDir).toBeDefined();
  });

  test('should not allow moving a directory into its child and return false', () => {
    root['parent'] = { child: {} };
    const result = utils.moveDirectory({ sourcePath: 'parent', targetPath: 'parent/child' });
    expect(result).toBe(false);
  });
});
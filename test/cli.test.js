import fs from 'fs';
import { exec } from 'child_process';
import {
  toType,
  generateTypes,
  getAllStrings,
  getKeyStrings,
  getString,
} from '../cli';
import translation from './test-helpers';

jest.mock('fs');

const argv = [...process.argv];

const cli = args => {
  return new Promise(resolve => {
    exec(
      `generate-i18n-types ${args.join(' ')} --output`,
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      }
    );
  });
};

describe('generate-i18n-types', () => {
  it('should have toType return correct type format', () => {
    const key = 'authFirst.text';
    expect(toType(key)).toBe('AuthFirstText');
  });

  it('should have getAllStrings return array of keys', () => {
    const stringsArray = [
      'appName',
      'supportEmail',
      'authFirst.text',
      'errors.invalidUsers',
    ];
    expect(getAllStrings(translation)).toStrictEqual(stringsArray);
  });

  it('should have getString return string for key', () => {
    const key = 'authFirst.text';
    expect(getString(translation, key)).toBe(
      'Before we can create your account, please <{{url}}|authenticate with My App>.'
    );
  });

  it('should have getKeyStrings return array of initial keys', () => {
    const keyStringsArray = [
      '.appName',
      '.supportEmail',
      ['.authFirst.text'],
      ['.errors.invalidUsers'],
    ];
    expect(getKeyStrings(translation)).toStrictEqual(keyStringsArray);
  });

  it('should have generateTypes generate 2 files', async () => {
    await generateTypes(translation);
    expect(fs.writeFileSync).toBeCalledTimes(2);
    expect(fs.writeFileSync.mock.calls).toMatchSnapshot();
  });

  it('should return error message if missing a required argument', async () => {
    argv.pop();
    const result = await cli(argv);
    expect(result.error.toString()).toContain(
      'Argument check failed: missing required arguments'
    );
  });

  it('should return no error when all arguments are present', async () => {
    const result = await cli(process.argv);
    expect(result.error).toBe(null);
  });
});

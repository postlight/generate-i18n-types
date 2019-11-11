import fs from 'fs';
import {
  toType,
  generateTypes,
  getAllStrings,
  getKeyStrings,
  getString,
} from '../cli';
import translation from './test-helpers';

jest.mock('fs');

describe('generate-i18n-types', () => {
  it('should have toType return correct type format', () => {
    const key = 'authFirst.text';
    expect(toType(key)).toBe('AuthFirstText');
  });

  it('should have getAllStrings return array of keys', () => {
    const stringsArray = [
      'appName',
      'supportEmail',
      'shared.contactSupport',
      'authFirst.text',
      'errors.invalidDate',
      'errors.missingIds',
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
      ['.shared.contactSupport'],
      ['.authFirst.text'],
      ['.errors.invalidDate', '.errors.missingIds', '.errors.invalidUsers'],
    ];
    expect(getKeyStrings(translation)).toStrictEqual(keyStringsArray);
  });

  it('should have generateTypes generate 2 files', async () => {
    await generateTypes(translation);
    expect(fs.writeFileSync).toBeCalledTimes(2);
    expect(fs.writeFileSync.mock.calls).toMatchSnapshot();
  });
});

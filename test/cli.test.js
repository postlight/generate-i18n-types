import {
  toType,
  generateTypes,
  getAllStrings,
  getKeyStrings,
  getString,
} from '../cli';
import { translation } from './test-helpers';

jest.mock('fs');
jest.mock('path');

describe('generate-i18n-types', () => {
  it('should have toType return correct type format', () => {
    const key = 'authFirst.text';
    expect(toType(key)).toBe('AuthFirstText');
  });

  it('should have getAllStrings return array of key strings', () => {
    const stringsArray = [
      'appName',
      'supportEmail',
      'shared.contactSupport',
      'authFirst.text',
      'errors.invalidDate',
      'errors.promptToEndMissingValue',
      'errors.missingIds',
    ];
    expect(getAllStrings(translation)).toStrictEqual(stringsArray);
  });

  it('should have getString return string for key', () => {
    const key = 'authFirst.text';
    expect(getString(translation, key)).toBe(
      'Before we can create your account, please <{{url}}|authenticate with My App>.'
    );
  });

  it('should have getKeyStrings return string for key', () => {
    const keyStringsArray = [
      '.appName',
      '.supportEmail',
      ['.shared.contactSupport'],
      ['.authFirst.text'],
      [
        '.errors.invalidDate',
        '.errors.promptToEndMissingValue',
        '.errors.missingIds',
      ],
    ];
    expect(getKeyStrings(translation)).toStrictEqual(keyStringsArray);
  });
});

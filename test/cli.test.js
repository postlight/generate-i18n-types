const fs = require('fs');
const exec = require('child_process').exec;
const args = [
  '--translations',
  'test/__mocks__/mockTranslation.yml',
  '--stringTypes',
  'test/__mocks__/mockStringTypes.ts',
  '--util',
  'test/__mocks__/mockI18n.ts',
];

const clearGeneratedFiles = () => {
  fs.writeFile(args[5], '');
  fs.writeFile(args[3], '');
};

afterAll(() => clearGeneratedFiles());

describe('generate-i18n-types', () => {
  test('With existing files code should be 0', async () => {
    let result = await cli(args, '.');
    expect(result.code).toBe(0);
  });

  test('With non-existent files code should be 1', async () => {
    args[1] = 'test/__mocks__/mock.yml';
    let result = await cli(args, '.');
    expect(result.code).toBe(1);
  });

  test('With incorrect argument code should be 1', async () => {
    args[0] = 'translate';
    let result = await cli(args, '.');
    expect(result.code).toBe(1);
  });
});

const cli = (args, cwd) => {
  return new Promise(resolve => {
    exec(
      `generate-i18n-types ${args.join(' ')}`,
      { cwd },
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

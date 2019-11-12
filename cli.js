#!/usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2));
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { flattenDeep } = require('lodash');

const { translation } = yaml.safeLoad(
  fs.readFileSync(`./${argv.translations}`, 'utf8')
);

const getKeyStrings = (obj, initialKey = '') => {
  const keys = Reflect.ownKeys(obj);
  return keys.map(key =>
    typeof obj[key] === 'string'
      ? `${initialKey}.${key}`
      : getKeyStrings(obj[key], `${initialKey}.${key}`)
  );
};

const getString = (obj, key) => key.split('.').reduce((acc, k) => acc[k], obj);

const getAllStrings = obj => {
  return flattenDeep(getKeyStrings(obj)).map(s => s.slice(1));
};

const toType = key =>
  key
    .split('.')
    .map(s => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join('');

const generateTypes = async obj => {
  // Turn json to key utils
  const keyStringsArr = getAllStrings(obj);

  // Generate string enum names that map to key utils
  const stringsAsEnumProp = keyStringsArr.map(toType);

  // Identify utils that require data
  const allStrings = keyStringsArr.map(key => getString(obj, key));
  const dataRe = /\{\{(\w+)\}\}/g;
  const stringsWithData = allStrings.map(str => {
    let match = dataRe.exec(str);
    const matches = [];
    while (match) {
      matches.push(match[1]);
      match = dataRe.exec(str);
    }
    return matches.length > 0 ? matches : null;
  });

  // Generate the enum
  const noArgsStrings = keyStringsArr.filter(
    (k, index) => !stringsWithData[index]
  );
  const stringsWithArgs = keyStringsArr.filter(
    (k, index) => stringsWithData[index]
  );

  const stringArgsEnum = 'I18NStringsWithArgs';
  const stringEnum = 'I18NStrings';
  const comments = `/* tslint:disable */\n/* eslint-disable */\n// This file was automatically generated and should not be edited.`;

  const enumsWithArgsString = `${stringsWithArgs.reduce((acc, key) => {
    return `${acc}
  ${toType(key)} = '${key}',`;
  }, `export enum ${stringArgsEnum} {`)}
}`;
  const enumNoArgsString = `${noArgsStrings.reduce((acc, key) => {
    return `${acc}
  ${toType(key)} = '${key}',`;
  }, `export enum ${stringEnum} {`)}
}`;

  // Write enums to stringTypesPath file
  fs.writeFileSync(
    `./${argv.stringTypesPath}`,
    `${comments}\n\n${enumsWithArgsString}\n\n${enumNoArgsString}`
  );

  // Write overloaded signatures with data requirements
  const overloadedSignature = `function translate(
  key: ${stringArgsEnum}.REPLACE_ENUM,
  REPLACE_DATA
): string;`;
  const overloadedSignatures = `${stringsWithData
    .map((arr, index) => {
      if (arr === null) {
        return false;
      }
      return overloadedSignature
        .replace('REPLACE_ENUM', stringsAsEnumProp[index])
        .replace(
          'REPLACE_DATA',
          `{ ${arr.join(', ')} }: { ${arr
            .map(key => `${key}: string`)
            .join(';')} }`
        );
    })
    .filter(Boolean)
    .join('\n')}\nfunction translate(key: ${stringEnum}): string;`;

  // Write content to utilPath file
  const i18nPath = `./${argv.utilPath}`;
  const i18nPathDir = argv.utilPath.slice(0, argv.utilPath.lastIndexOf('/'));
  const stringTypesDir = argv.stringTypesPath.replace(
    path.extname(argv.stringTypesPath),
    ''
  );

  const readTranslation =
    'const en = yaml.safeLoad(\n' +
    `    fs.readFileSync('./${argv.translations}', 'utf8')\n` +
    `);\n\n`;

  const sigils = [
    '// ==== START OVERLOADED SIGNATURES',
    '// ==== END OVERLOADED SIGNATURES',
  ];

  const imports = `import i18n from 'i18next';\nimport yaml from 'js-yaml';\nimport fs from 'fs';\nimport { ${stringEnum}, ${stringArgsEnum} } from '${path.relative(
    i18nPathDir,
    stringTypesDir
  )}';`;

  const translate =
    'function translate(key: string, data?: { [key: string]: string }) {\n' +
    '    if (boundT) {\n' +
    '        return boundT(key, data);\n' +
    '    }\n' +
    '    i18n.init({\n' +
    "        lng: 'en',\n" +
    '        resources: { en },\n' +
    '        interpolation: {\n' +
    '            escapeValue: false,\n' +
    '        },\n' +
    '    });\n' +
    '    const { t } = i18n;\n' +
    '    boundT = t.bind(i18n);\n' +
    '    return boundT(key, data);\n' +
    '}\n\nexport default translate;';

  const content = `${comments}\n\n${imports}\n\nexport {  ${stringEnum}, ${stringArgsEnum} } from '${path.relative(
    i18nPathDir,
    stringTypesDir
  )}';\n\nlet boundT: typeof i18n.t;\n\n${readTranslation}${
    sigils[0]
  }\n${overloadedSignatures}\n${sigils[1]}\n\n${translate}`;

  fs.writeFileSync(i18nPath, content);
};

if (translation) {
  generateTypes(translation);
}

module.exports = {
  getKeyStrings,
  getString,
  getAllStrings,
  generateTypes,
  toType,
};

const { flattenDeep } = require('lodash');

const optionDefinitions = [
  {
    name: 'translations',
    description:
      'This is the path to the YAML file you want to generate types for. Currently this only supports input of a single file.',
    type: String,
    typeLabel: '={underline file}',
  },
  {
    name: 'stringTypesPath',
    description:
      'This is the path to the file where you want the generated string types to reside.',
    type: String,
    multiple: true,
    defaultOption: true,
    typeLabel: '={underline file}',
  },
  {
    name: 'utilPath',
    description:
      'This is the path to the file where you want the generated translation functions for the string types to reside.',
    type: String,
    typeLabel: '={underline file}',
  },
];

const sections = [
  {
    header: 'generate-i18n-types',
    content:
      ' generate-18n-types generates types for internationalization strings.',
  },
  {
    content: '{bold ●  Error: Missing required arguments}',
  },
  {
    header: 'Usage',
    content:
      '$ generate-i18n-types {bold --translations}={underline file} {bold --stringTypesPath}={underline file} {bold --utilPath}={underline file}',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
];

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

module.exports = {
  sections,
  getKeyStrings,
  getString,
  getAllStrings,
  toType,
};

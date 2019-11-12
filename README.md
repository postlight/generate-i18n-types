# generate-i18n-types

[Postlight](https://postlight.com)'s Generate i18n Types generates types for internationalization strings.

## Installation

```shell
$ yarn add @postlight/generate-18n-types i18next @types/js-yaml
```

The package also requires installation of `i18next` and `@types/js-yaml`

## Usage

This generator accepts 3 arguments to generate your i18n types
```shell
$ generate-i18n-types --translations=path/to/translation.yml --stringTypesPath=path/to/strings.ts --utilPath=path/to/i18n.ts
```

`--translations`
This is the path to the YAML file you want to generate types for. Currently this only supports input of a single file. For an example of the format of the YAML file, see [example.yaml](./example.yaml)

`--stringTypesPath`
This is the path to the file where you want the generated string types to reside.

`--utilPath`
This is the path to the file where you want the generated translation functions for the string types to reside.

Note:
You may require additional formatting of the generated `utilPath` file. Using Prettier as an example, you can just add the following additional command to the above
`&& prettier --write ./path/to/i18n.ts`

Once the command succeeds, it will automatically generate the `enum` types for the app strings in the translation file, along with matching function signatures if the strings have dynamic fields. Then you can use the new translations in your code. Enjoy!

## Example

`generate-i18n-types` takes a YAML file you want translated

```yaml
translation:
  appName: 'My App'
  supportEmail: 'hello@my-app.com'
  authFirst:
    text: 'Before we can create your account, please <{{url}}|authenticate with My App>.'
  errors:
    invalidUsers: 'The following people could not be invited: {{invalidUsers}}'
```
 Then generates the enum types for the `stringTypesPath` file

```typescript
/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

export enum I18NStringsWithArgs {
  AuthFirstText = 'authFirst.text',
  ErrorsInvalidUsers = 'errors.invalidUsers',
}

export enum I18NStrings {
  AppName = 'appName',
  SupportEmail = 'supportEmail',
}
```
And the corresponding translate functions and required packages and imports/exports for the `utilPath` file

```typescript
/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import i18n from 'i18next';
import yaml from 'js-yaml';
import fs from 'fs';
import { I18NStrings, I18NStringsWithArgs } from '../types/strings';

export { I18NStrings, I18NStringsWithArgs } from '../types/strings';

let boundT: typeof i18n.t;

const en = yaml.safeLoad(
  fs.readFileSync('../../locales/en/translation.yml', 'utf8')
);

// ==== START OVERLOADED SIGNATURES
function translate(
  key: I18NStringsWithArgs.AuthFirstText,
  { url }: { url: string }
): string;
function translate(
  key: I18NStringsWithArgs.ErrorsInvalidUsers,
  { invalidUsers }: { invalidUsers: string }
): string;
function translate(key: I18NStrings): string;
// ==== END OVERLOADED SIGNATURES

function translate(key: string, data?: { [key: string]: string }) {
  if (boundT) {
    return boundT(key, data);
  }
  i18n.init({
    lng: 'en',
    resources: { en },
    interpolation: {
      escapeValue: false,
    },
  });
  const { t } = i18n;
  boundT = t.bind(i18n);
  return boundT(key, data);
}

export default translate;
```


## License

Licensed under either of the below, at your preference:

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
  
## Contributing

For details on how to contribute, see [CONTRIBUTING.md](./CONTRIBUTING.md)

Unless it is explicitly stated otherwise, any contribution intentionally
submitted for inclusion in the work, as defined in the Apache-2.0 license,
shall be dual licensed as above without any additional terms or conditions.

---

🔬 A Labs project from your friends at [Postlight](https://postlight.com). Happy coding!


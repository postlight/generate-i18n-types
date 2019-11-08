# generate-i18n-types

[Postlight](https://postlight.com)'s Generate i18n Types generates types for internationalization strings.

## Installation

```shell
$ yarn add generate-18n-types i18next js-yaml
```

The package also requires installation of `i18next` and `js-yaml`

## Usage

This generator accepts 3 arguments to generate your i18n types
```shell
$ generate-i18n-types --translations=path/to/translation.yml --stringTypes=path/to/strings.ts --util=path/to/translate.ts
```

`--translations`
This is the path to the YAML file you want to generate types for. Currently this only supports input of a single file. For an example of the format of the YAML file, see [example.yaml](./example.yaml)

`--stringTypes`
This is the path to the file where you want the generated string types to reside.

`--util`
This is the path to the file where you want the generated translation functions for the string types to reside.

Once the command succeeds, the files you provided will have the necessary string types and translation functions. Enjoy!

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


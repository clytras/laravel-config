# Laravel Config

Use Laravel app configuration directly to Node scripts.

Main purpose is for using along with Laravel Mix to extend configurations and pass config values to Webpack, Sass, PostCss and all the available plugins that Mix provides. Nevertheless, it can be used for any node script that will run under the application root directory (*where `bootstrap/` directory is located*).

## Usage

```js
const AppConfig = require('@lytrax/laravel-config');

const config = AppConfig();

// All of Laravel cached configuration will now be loaded into the config constant
```

## Development

- Commit changes to GitHub using [commitizen][commitizen] `git cz`

## Publish

Always commit everything before publishing new releases.

1. `yarn build` to build the distribution files
2. `yarn deploy` or `np --contents=release` to bump version, run release script and publish to NPM and GitHub

Running `np` will have the `version` script executed which will run the `makeRelease` script.

## License

MIT [LICENSE][license]

[commitizen]: https://github.com/commitizen/cz-cli
[license]: https://github.com/clytras/laravel-config/blob/master/LICENSE

# Laravel Config

Use Laravel app configuration directly to Node scripts.

Main purpose is for using along with Laravel Mix to extend configurations and pass config values to Webpack, Sass, PostCss and all the available plugins that Mix provides. Nevertheless, it can be used for any node script that will run under the application root directory (*where `bootstrap/` directory is located*).

## Usage

```js
const { getLaravelConfig } = require('@lytrax/laravel-config');

const config = getLaravelConfig();

// All of Laravel cached configuration will now be loaded into the config constant
```

If you want to change the base path root where the `bootstrap/` directory is located, you can use the `basePath` option:

```
const { getLaravelConfig } = require('@lytrax/laravel-config');

const config = getLaravelConfig({ basePath: '/my/path/to/app/root' });
```

### Config Cache

Remember to always refresh/update the config cache after every config update so to fetch the new configuration instantly.

```
php artisan config:cache
```

or

```
sail artisan config:cache
```

### How it works

The `getLaravelConfig` function uses PHP CLI to execute a direct command to echo an encoded JSON of the `bootstrap/cache/config.php` file which is the Laravel cached configuration. It uses `process.cwd()` to get the current working directory and use it for the base directory, in which the `bootstrap/` directory should be located. We can change the base directory using the option `basePath`.

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

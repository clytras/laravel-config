const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

interface Options {
  basePath?: string;
}

export default function getAppConfig({ basePath }: Options = {}) {
  const base = basePath ?? process.cwd();
  const cacheConfigFile = path.resolve(
    base,
    'bootstrap',
    'cache',
    'config.php'
  );

  if (fs.existsSync(cacheConfigFile)) {
    try {
      const config = execSync(
        `php -r "echo json_encode(include('${cacheConfigFile}'));"`,
        { encoding: 'utf-8' }
      );

      if (config && config.length) {
        try {
          return JSON.parse(config);
        } catch (error) {
          console.error(
            'Laravel config cache file returned invalid JSON data',
            error
          );
        }
      }
    } catch (error) {
      console.error('Could not load Laravel config file', error);
    }
  } else {
    console.error(`File "${cacheConfigFile}" does not exist.`);
  }

  return null;
}

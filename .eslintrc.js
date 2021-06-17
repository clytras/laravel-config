module.exports = {
  extends: [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  settings: {
    "react": {
      "version": "999.999.999"
    }
  }
}


// module.exports = {
//   extends: 'plugin:@typescript-eslint/recommended',
//   rules: {
//     // A temporary hack related to IDE not resolving correct package.json
//     // 'import/no-extraneous-dependencies': 'off',
//     '@typescript-eslint/no-use-before-define': 'off',
//     '@typescript-eslint/lines-between-class-members': 'off',
//     '@typescript-eslint/ban-ts-ignore': 'off',
//     'no-plusplus': 'off',
//     'no-restricted-syntax': 'off',
//     'no-sparse-arrays': 'off',
//     'no-underscore-dangle': 'off',
//     'no-fallthrough': 'off',
//     'no-empty': 'off',
//   },
//   parserOptions: {
//     ecmaVersion: 2020,
//     sourceType: 'module',
//     project: './tsconfig.json',
//     tsconfigRootDir: __dirname,
//     createDefaultProgram: true,
//   },
//   settings: {
//     'import/parsers': {
//       '@typescript-eslint/parser': ['.ts', '.tsx'],
//     },
//   },
// };

module.exports = {
  printWidth: 150,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: "always",
  requirePragma: false,
  vueIndentScriptAndStyle: false,
  htmlWhitespaceSensitivity: "ignore",
  overrides: [
    {
      files: "*.js",
      options: {
        parser: "js"
      }
    },
    {
      files: "*.ts",
      options: {
        parser: "typescript"
      }
    },
    {
      files: "*.vue",
      options: {
        parser: "vue"
      }
    },
  ]
}

/**
 * Factorial Eslint custom rules
 *
 * If you want to create a new Factorial custom rules, go to https://astexplorer.net/
 * with some example source code example to be able to see the AST tree.
 *
 * Investigate which kind of AST node do you want to match and create here a
 * rule for it. Then add it to .eslintrc.js configuration file.
 */
const fs = require('fs')
const path = require('path')

const eslintFolder = './rules'
const ruleFiles = fs
  .readdirSync(eslintFolder)
  .filter((file) => file !== 'index.js' && !file.endsWith('test.js'))

const rules = Object.fromEntries(
  ruleFiles.map((file) => [path.basename(file, '.js'), require(`./${file}`)])
)

module.exports = { rules }
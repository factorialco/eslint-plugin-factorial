const path = require('path')
const fs = require('fs')
const yaml = require('yaml')

const retrieveAllowedCollections = (fileName) => {
  const regex = /modules\/(?<module>[^\/]+)/
  const matchFileName = fileName.match(regex)

  if (!matchFileName) return []

  const { module: moduleFileName } = matchFileName.groups

  const packagePath = path.join(process.cwd(), 'src/modules', moduleFileName, 'package.yml')

  if (!fs.existsSync(packagePath)) {
    console.warn(
      `Unable to retrieve allowed collections because '${packagePath}' file doesn't exists.`
    )
    return []
  }

  try {
    const { collections } = yaml.parse(fs.readFileSync(packagePath, 'utf8'))

    return collections ?? []
  } catch (error) {
    console.error(error)
    console.warn(
      `Unable to retrieve allowed collections because '${packagePath}' file is not a valid YAML.`
    )

    return []
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const fileName = context.getFilename()
    const allowedCollections = retrieveAllowedCollections(fileName)

    // console.log(`Allowed collections for file: ${fileName}`, allowedCollections)

    // NOTE: If user collection is allowed, then access collection is also
    // allowed because it is an alias. We are in the process of renaming the
    // uses collection to access collection.
    if (allowedCollections.includes('modules/core/store/collections/users')) {
      allowedCollections.push('modules/core/store/collections/accesses')
    }

    const reportWarning = (node) => {
      context.report({
        node,
        message:
          'You are not allowed to use this collection in this module. Try to use GraphQL counterpart',
      })
    }

    return {
      ImportDeclaration: function (node) {
        const value = node.source.value

        const validImport = node.importKind !== 'type'
        const validSource = value && value.includes('store/collections')
        const validSpecifier = node.specifiers.filter((specifier) => {
          return specifier.importKind === 'value'
        }).length > 0

        if (validImport && validSource && validSpecifier) {
          if (!allowedCollections.includes(value)) {
            reportWarning(node)
          }
        }
      },
    }
  },
}

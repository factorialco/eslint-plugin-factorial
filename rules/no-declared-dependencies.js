const path = require('path')
const fs = require('fs')
const yaml = require('yaml')

const formatFilename = (filename, removeExtension = false) => {
  let result = filename.replace(/^(.*)\/modules/, 'modules')

  if (!removeExtension) {
    return result
  }

  return result.replace(/(\..*)$/, '')
}

// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      ImportDeclaration: function (node) {
        const fileName = context.getFilename()
        const regex = /modules\/(?<module>[^\/]+)/

        const value = node.source.value

        const matchFileName = fileName.match(regex)
        const matchNode = value.match(regex)

        if (matchFileName && matchNode) {
          const { module: moduleFileName } = matchFileName.groups
          const { module: moduleNode } = matchNode.groups

          if (moduleFileName === moduleNode) return
          if (moduleNode === 'core') return

          const package = path.join(process.cwd(), 'src/modules', moduleFileName, 'package.yml')

          if (!fs.existsSync(package)) {
            console.warn(
              `Unable to decide if this import in '${fileName}' is a valid dependency because '${package}' file doesn't exists.`
            )

            return
          }

          try {
            const { dependencies = [] } = yaml.parse(
              fs.readFileSync(package, 'utf8')
            )

            if (!dependencies.includes(matchNode)) {
              context.report({
                node,
                message: `Avoid using elements from another module that are not declared as valid dependency. Review the list of 'dependencies' in file ${formatFilename(
                  package
                )} and decide if '${moduleNode}' should be a dependency for this module.`,
              })
            }
          } catch (error) {
            console.error(error)
            console.warn(
              `Unable to decide if this import in '${fileName}' is a valid dependency because '${package}' file is not a valid YAML.`
            )
          }
        }
      },
    }
  },
}
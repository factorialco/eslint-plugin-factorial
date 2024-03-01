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
        const regex = /^modules\/(?<module>[^\/]+)/

        const value = node.source.value

        const matchFileName = fileName.match(regex)
        const matchNode = value.match(regex)

        if (matchFileName && matchNode) {
          const { module: moduleFileName } = matchFileName.groups
          const { module: moduleNode } = matchNode.groups

          if (moduleFileName === moduleNode) return

          const package = path.join(process.cwd(), 'src/modules', moduleNode, 'package.yml')

          if (!fs.existsSync(package)) {
            console.warn(
              `Unable to decide if this import in '${fileName}' is a valid one because '${package}' file doesn't exists.`
            )

            return
          }

          try {
            const { public: publicImports } = yaml.parse(
              fs.readFileSync(package, 'utf8')
            )

            if (!publicImports.includes(value)) {
              context.report({
                node,
                message: `Avoid using elements from another module that are not declared as public.\n\nYou can update the file ${formatFilename(
                  package
                )} and add ${value}\n\n- To the public list so that dependency can be used outside of the module.\n\n`,
              })
            }
          } catch (error) {
            console.error(error)
            console.warn(
              `Unable to decide if this import in '${fileName}' is a valid one because '${package}' file is not a valid YAML.`
            )
          }
        }
      },
    }
  },
}

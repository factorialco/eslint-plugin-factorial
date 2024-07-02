const path = require('path')
const fs = require('fs')
const yaml = require('yaml')

const exceptions = ['navigation.ts', 'sidebar.ts', 'events.ts']

const specialFile = (fileName) => {
  return exceptions.some((exception) => fileName.endsWith(exception))
}

const formatFilename = (filename, removeExtension = false) => {
  let result = filename.replace(/^(.*)\/modules/, 'modules')

  if (!removeExtension) {
    return result
  }

  return result.replace(/(\..*)$/, '')
}

const declaredDepenency = (fileName, matchNode, package) => {
  if (!fs.existsSync(package)) {
    console.warn(
      `Unable to decide if this import in '${fileName}' is a valid dependency because '${package}' file doesn't exists.`
    )

    return true
  }

  try {
    const { dependencies = [] } = yaml.parse(
      fs.readFileSync(package, 'utf8')
    )

    return dependencies.includes(matchNode)
  } catch (error) {
    console.error(error)
    console.warn(
      `Unable to decide if this import in '${fileName}' is a valid dependency because '${package}' file is not a valid YAML.`
    )
    return true
  }
}

// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      ImportDeclaration: function (node) {
        const fileName = context.getFilename()
        const moduleRegex = /modules\/(?<module>[^\/]+)/
        const dsRegex = /design-system\//

        const value = node.source.value

        const matchFileName = fileName.match(moduleRegex)
        const matchNode = value.match(moduleRegex)

        // Invalid dependency: Design System must to have dependencies to other modules
        if (fileName.match(dsRegex) && matchNode) {
          context.report({
            node,
            message:
              `Design System must not be coupled to application modules such as ${matchNode.groups.module}`,
          })

          return
        }

        if (!matchFileName || !matchNode) return

        const { module: moduleFileName } = matchFileName.groups
        const { module: moduleNode } = matchNode.groups

        // Valid dependency, same module
        if (moduleFileName === moduleNode) return

        // Valid dependency because is 'core'
        if (moduleNode === 'core') return

        // Invalid dependency: Core must to have dependencies to other modules
        if (moduleFileName === 'core') {
          // Core can import special files because they will be bundled together
          if (specialFile(moduleNode)) return

          context.report({
            node,
            message:
              'Core must not have dependencies to other modules',
          })

          return
        }

        const package = path.join(process.cwd(), 'src/modules', moduleFileName, 'package.yml')

        // Check if is a declared dependency in the package.yml
        if (!declaredDepenency(fileName, matchNode, package)) {
          context.report({
            node,
            message: `Avoid using elements from another module that are not declared as valid dependency. Review the list of 'dependencies' in file ${formatFilename(
              package
            )} and decide if '${moduleNode}' should be a dependency for this module.`,
          })

          return
        }

        // Check that special files don't import extra stuff from other modules
        if (specialFile(fileName)) {
          context.report({
            node,
            message: `Special files like (${exceptions.join(', ')} can not import elements from another module because they will be bundled in 'core' module`
          })
        }
      }
    }
  },
}
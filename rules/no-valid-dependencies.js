const path = require('path')
const fs = require('fs')

const exceptions = ['navigation.ts', 'sidebar.ts', 'events.ts']

// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      ImportDeclaration: function (node) {
        const fileName = context.getFilename()
        const moduleRegex = /^modules\/(?<module>[^\/]+)/
        const dsRegex = /^design-system\//

        const value = node.source.value

        const matchFileName = fileName.match(moduleRegex)
        const matchNode = value.match(moduleRegex)

        const specialFile = (fileName) => {
          return exceptions.some((exception) => fileName.endsWith(exception))
        }

        if (matchFileName && matchNode) {
          const { module: moduleFileName } = matchFileName.groups
          const { module: moduleNode } = matchNode.groups

          // Valid depedency, same module
          if (moduleFileName === moduleNode) return

          // Invalid dependency: Core must to have dependencies to other modules
          if (moduleFileName === 'core' && !specialFile(moduleNode)) {
            context.report({
              node,
              message:
                'Core must not have dependencies to other modules',
            })
          }

          // TODO: We need to check that special files don't import extra stuff from other modules

          // Invalid dependency: Design System must to have dependencies to other modules
          if (fileName.match(dsRegex)) {
            context.report({
              node,
              message:
                'Design System must not have dependencies to other modules',
            })
          }

          // Invalid dependency: Module one is coupled to module two
          context.report({
            node,
            message:
              `'${moduleFileName}' module is coupled to '${moduleNode}' module. This is not allowed`
          })
        }
      },
    }
  },
}

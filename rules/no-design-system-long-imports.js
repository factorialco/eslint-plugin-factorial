const IGNORED_IMPORTS = ['design-system/tokens', 'design-system/theme']

module.exports = {
  create(context) {
    return {
      ImportDeclaration: function (node) {
        const fileName = context.getFilename()
        const value = node.source.value

        if (fileName.includes('src/design-system')) {
          return
        }

        if (IGNORED_IMPORTS.includes(value) || !value.startsWith('design-system/')) {
          return
        }

        context.report({
          node,
          message: "Use `import { foo } from 'design-system'` instead of regular imports.",
        })
      },
    }
  },
}

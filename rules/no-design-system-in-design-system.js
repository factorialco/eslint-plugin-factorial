module.exports = {
  create(context) {
    return {
      ImportDeclaration: function (node) {
        const fileName = context.getFilename()
        const value = node.source.value

        if (!fileName.includes('src/design-system')) {
          return
        }

        if (value !== 'design-system') {
          return
        }

        context.report({
          node,
          message:
            "Do not import things from the 'design-system' hub file. Use the full path to the file to avoid circular dependencies.",
        })
      },
    }
  },
}

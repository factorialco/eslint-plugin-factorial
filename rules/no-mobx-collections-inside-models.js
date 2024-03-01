module.exports = {
  create(context) {
    const fileName = context.getFilename()

    if (!fileName.includes('store/models')) {
      return {}
    }

    let collectionIdentifiers = []

    const reportWarning = (node) => {
      context.report({
        node,
        message:
          'Do not use collections inside models. This is a bad pattern because it creates circular dependencies and it assumes a global state.',
      })
    }

    return {
      ImportDeclaration: function (node) {
        if (node.source.value.includes('store/collections')) {
          collectionIdentifiers.push(node.specifiers[0].local.name)

          reportWarning(node)
        }
      },
      Identifier: function (node) {
        if (collectionIdentifiers.includes(node.name) && !node.parent.type.includes('Import')) {
          reportWarning(node)
        }
      },
    }
  },
}

module.exports = {
  create(context) {
    const collectionIdentifiers = new Set()

    return {
      ImportDeclaration: function (node) {
        if (!node.source.value.match(/store\/collections/)) return

        node.specifiers.forEach((specifier) => {
          collectionIdentifiers.add(specifier.local.name)
        })
      },
      Identifier: function (node) {
        if (!collectionIdentifiers.has(node.name)) return

        let parent = node.parent

        while (
          parent.type !== 'ImportDeclaration' &&
          parent.type !== 'Program' &&
          parent.type !== 'Program' &&
          parent.type !== 'ArrowFunctionExpression' &&
          parent.type !== 'FunctionDeclaration' &&
          parent.type !== 'FunctionExpression'
        ) {
          parent = parent.parent
        }

        if (parent.type !== 'Program') return

        context.report({
          node,
          message:
            'Take into account that mobx collections are lazy loaded. Move this check inside a React component or a function.',
        })
      },
    }
  },
}

module.exports = {
  create(context) {
    return {
      CallExpression: function (node) {
        if (node.callee.type !== 'Identifier') return
        if (node.callee.name !== 'hasFeature') return

        let parent = node.parent

        while (
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
            'Take into account that features are lazy loaded. Move this check inside a React component or a function.',
        })
      },
    }
  },
}

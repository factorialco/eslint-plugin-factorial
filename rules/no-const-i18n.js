module.exports = {
  create(context) {
    return {
      CallExpression: function (node) {
        if (node.callee.type !== 'MemberExpression') return
        if (node.callee.object.name !== 'i18n' && node.callee.object.name !== 'i18next') return
        if (node.callee.property.name !== 't') return

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
            "Take into account that the i18n library is lazy loaded. You can't compute this static time. Also, we encourage you to use i18n.t directly in the component.",
        })
      },
    }
  },
}

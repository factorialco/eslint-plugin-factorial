/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const reportWarning = (node) => {
      context.report({
        node,
        message:
          'Try using our design-system as much as possible. Avoid using raw html nodes',
      })
    }

    return {
      JSXOpeningElement: function (node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name.match(/^[a-z]/)) {
          reportWarning(node)
        }
      },
    }
  },
}

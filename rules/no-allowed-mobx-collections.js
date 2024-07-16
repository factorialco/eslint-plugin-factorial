/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const reportWarning = (node) => {
      context.report({
        node,
        message:
          'mobx-rest is deprecated. Use GraphQL instead.',
      })
    }

    return {
      ImportDeclaration: function (node) {
        const value = node.source.value

        const validImport = node.importKind !== 'type'
        const validSource = value && value.includes('store/collections')
        const validSpecifier = node.specifiers.filter((specifier) => {
          return specifier.parent.importKind === 'value'
        }).length > 0

        if (validImport && validSource && validSpecifier) {
          reportWarning(node)
        }
      },
    }
  },
}
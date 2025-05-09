// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      JSXAttribute: function (node) {
        if (node.name.type !== 'JSXIdentifier') return
        if (node.name.name !== 'aria-label') return
        if (node.value.type !== 'Literal' && node.value.type !== 'TemplateLiteral' && node.value.type !== 'StringLiteral') return

        context.report({
          node,
          message: 'Accessible browsers read aria-label attribute, so you should not set it statically. Use the i18n library instead.',
        })
      },
    }
  },
}

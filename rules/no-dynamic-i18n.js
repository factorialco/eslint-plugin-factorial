module.exports = {
  create(context) {
    const funcs = ['t', 'tp', 'tRole', 'tCurrent', 'getKey']

    return {
      CallExpression: function (node) {
        if (node.callee.type !== 'MemberExpression') return
        if (node.callee.object.type !== 'Identifier') return
        if (node.callee.object.name !== 'i18n') return
        if (node.callee.property.type !== 'Identifier') return
        if (!funcs.includes(node.callee.property.name)) return

        // Valid ones:
        // - i18n.t("foo.bar")
        // - i18n.t(`foo.bar`)
        const valid = (
          (node.arguments[0].type === 'Literal') ||
          (node.arguments[0].type === 'TemplateLiteral' && path.value.arguments[0].quasis.length === 1)
        )

        if (!valid) {
          context.report({
            node,
            message:
              "Don't use i18n with dynamic keys. It makes really hard to detect which ones are used in the long term",
          })
        }
      },
    }
  },
}

module.exports = {
  create(context) {
    return {
      SwitchStatement: function (node) {
        if (node.discriminant.type !== 'Literal') return

        context.report({
          node,
          message:
            "This incident will be reported. Don't use switch to check simple conditions.",
        })
      },
    }
  },
}

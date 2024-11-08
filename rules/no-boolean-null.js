module.exports = {
  create(context) {
    return {
      TSUnionType: function (node) {
        const types = node.types.map((item) => item.type)

        if (!types.includes("TSBooleanKeyword")) return
        if (!types.includes("TSNullKeyword")) return

        context.report({
          node,
          message:
            "Try to avoid this kind of typing. Booleans don't need a null case."
        })
      },
    }
  },
}

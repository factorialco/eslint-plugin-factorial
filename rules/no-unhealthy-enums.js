module.exports = {
  create(context) {
    return {
      TSEnumDeclaration: function (node) {
        const allEqual = node.members.reduce((memo, item) => {
          if (!item.initializer) return true
          if (!item.initializer.type.includes('Literal')) return false
          if (item.id.type !== 'Identifier') return false

          return memo && item.id.name.toLowerCase() === item.initializer.value.toLowerCase()
        }, true)

        if (allEqual) {
          context.report({
            node,
            message:
              "This kind of enums are worthless and error prone. Double-check if you can use some crafted union type, or even one automatically provided by the GraphQL interface",
          })
        }
      },
    }
  },
}

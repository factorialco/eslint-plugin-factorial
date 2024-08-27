module.exports = {
  create(context) {
    return {
      TSEnumDeclaration: function (node) {
        const allEqual = node.members.reduce((memo, item) => {
          if (!item.initializer) return memo

          if (item.initializer.type !== 'Literal' && item.initializer.type !== 'StringLiteral') return false
          if (item.id.type !== 'Identifier') return false

          return memo && item.id.name.toLowerCase() === item.initializer.value.toString().toLowerCase()
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

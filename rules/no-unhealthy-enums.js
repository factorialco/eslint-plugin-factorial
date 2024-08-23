module.exports = {
  create(context) {
    return {
      TSEnumDeclaration: function (node) {
        const allEqual = node.members.reduce((memo, item) => {
          if (!item.initializer.type.includes('Literal')) return false

          return memo && item.id.name.toLowerCase() === item.initializer.value.toLowerCase()
        }, true)

        if (allEqual) {
          context.report({
            node,
            message:
              "This kind of enums are worthless an error prone. Double-check if you can use some crafted union type, or even one provided by the GraphQL interface",
          })
        }
      },
    }
  },
}

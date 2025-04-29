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

      TSIndexedAccessType(node) {
        // Check if the object type is a typeof expression wrapped in parentheses
        const isTypeofObject = node.objectType.type === 'TSParenthesizedType' &&
          node.objectType.typeAnnotation.type === 'TSTypeQuery';

        // Check if the index type is a keyof typeof expression
        const isKeyofTypeof = node.indexType.type === 'TSTypeOperator' &&
          node.indexType.operator === 'keyof' &&
          node.indexType.typeAnnotation.type === 'TSTypeQuery';

        if (isTypeofObject && isKeyofTypeof) {
          context.report({
            node,
            message: "Consider using a more explicit type definition instead of extracting values using indexed access type.",
          });
        }
      }
    }
  },
}

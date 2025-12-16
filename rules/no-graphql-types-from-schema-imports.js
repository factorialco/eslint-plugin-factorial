const ALLOWED_PATTERNS = [
  /.*Document$/,
  /.*Query$/,
  /.*QueryVariables$/,
  /.*Fragment$/,
  /.*FragmentDoc$/,
  /.*Mutation$/,
  /.*MutationVariables$/,
  /.*Subscription$/,
  /.*SubscriptionVariables$/,
  /.*Filter$/,
  /.*FilterConditions$/,
  /.*Enum$/,
  /.*Page$/, // Review this one
  /.*Input$/,
  /^Maybe$/,
  /^InputMaybe$/,
  /^Exact$/,
  /^MakeOptional$/,
  /^MakeMaybe$/,
  /^MakeEmpty$/,
  /^Incremental$/,
]

// Check if a specifier name matches any allowed pattern
const isAllowedSpecifier = (specifier) => {
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(specifier))
}

const graphqlSchemaImport = 'generated/resources/graphql'

module.exports = {
  create(context) {
    const reportWarning = (node) => {
      context.report({
        node,
        message:
          'Do not use graphql types from schema imports. This is a bad pattern because you are coupling your code to the schema instead of your graphql operations.',
      })
    }

    return {
      ImportDeclaration: function (node) {
        const value = node.source.value

        if (value === graphqlSchemaImport) {
          for (const specifier of node.specifiers) {
            const specifierName = specifier.local.name
            if (!isAllowedSpecifier(specifierName)) {
              reportWarning(node)
              break // Report once per import statement
            }
          }
        }
      }
    }
  },
}

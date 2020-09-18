/**
 * Factorial Eslint custom rules
 *
 * If you want to create a new Factorial custom rules, go to https://astexplorer.net/
 * with some example source code example to be able to see the AST tree. Choose
 * `flow` or `acorn` parsers.
 *
 * Investigate which kind of AST node do you want to match and create here a
 * rule for it. Then add it to .eslintrc.js configuration file.
 */
const noImportReact = {
  create: function (context) {
    return {
      ImportDeclaration (node) {
        if (node.source.value !== 'react') return
        if (!node.specifiers.map(s => s.type).includes('ImportDefaultSpecifier')) return

        if (node.specifiers.length > 1) {
          context.report(node, 'Split the React import in two and import React generically')
        } else {
          context.report(node, 'Import React generically. More info: https://twitter.com/sebmarkbage/status/1250284377138802689?s=19')
        }
      }
    }
  }
}

const noAutobind = {
  create: function (context) {
    return {
      Decorator (node) {
        if (node.expression.type !== 'Identifier') return
        if (node.expression.name !== 'autobind') return

        context.report(node, 'Use @boundMethod instead of @autobind. More info: https://www.npmjs.com/package/autobind-decorator#performance')
      }
    }
  }
}

const noCustomMoment = {
  create: function (context) {
    return {
      Literal (node) {
        if (node.value !== 'YYYY-MM-DD') return // eslint-disable-line

        context.report(node, 'Use stringToDate and dateToString moment helpers')
      }
    }
  }
}

const noRenderIf = {
  create: function (context) {
    return {
      CallExpression (node) {
        if (node.callee.name !== 'renderIf') return

        context.report(node, 'renderIf is deprecated. Use conditional rendering: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator')
      }
    }
  }
}

module.exports = {
  rules: {
    'no-import-react': noImportReact,
    'no-autobind': noAutobind,
    'no-custom-moment': noCustomMoment,
    'no-render-if': noRenderIf
  }
}

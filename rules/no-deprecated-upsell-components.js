/**
 * @fileoverview ESLint rule to discourage using deprecated upsell components and promote UpsellingKit
 * @author Factorial Team
 */

const DEPRECATED_COMPONENTS = [
  "RequestUpgradeModal",
  "UpgradeModal",
  "UpsellModal",
  "UpsellModalModules",
];
const DEPRECATED_IMPORT_PATHS = [
  "modules/upsell/components/RequestUpgradeModal",
  "modules/upsell/components/UpgradeModal",
  "modules/upsell/components/UpsellModal",
  "modules/upsell/components/PlanUpgradeModal",
  "modules/upsell/components",
];

module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        const value = node.source.value;

        if (DEPRECATED_IMPORT_PATHS.includes(value)) {
          context.report({
            node,
            message:
              'Import UpsellingKit components from "modules/upselling_kit/components" instead of deprecated upsell components. Find components in the UpsellingKit documentation.',
          });
        }
      },

      JSXOpeningElement(node) {
        if (
          node.name?.type === "JSXIdentifier" &&
          DEPRECATED_COMPONENTS.includes(node.name.name)
        ) {
          context.report({
            node,
            message:
              "Use UpsellingKit components instead of deprecated upsell components. Find components in the UpsellingKit documentation.",
          });
        }
      },

      CallExpression(node) {
        if (
          node.callee?.type === "MemberExpression" &&
          node.callee.object?.name === "React" &&
          node.callee.property?.name === "createElement" &&
          node.arguments[0]?.type === "Identifier" &&
          DEPRECATED_COMPONENTS.includes(node.arguments[0].name)
        ) {
          context.report({
            node,
            message:
              "Use UpsellingKit components instead of deprecated upsell components. Find components in the UpsellingKit documentation.",
          });
        }
      },
    };
  },
};

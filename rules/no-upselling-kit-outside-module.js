const RESTRICTED_COMPONENTS = [
  "UpsellingBanner",
  "ProductCard",
  "ProductModal",
  "ProductWidget",
  "UpsellingPopover",
  "UpsellingButton",
];

const ALLOWED_FOLDER = "modules/upselling_kit";

module.exports = {
  create(context) {
    const filename = context.getFilename();

    // Check if the file is in the allowed folder
    const isInAllowedFolder = filename.includes(ALLOWED_FOLDER);

    return {
      ImportDeclaration(node) {
        const value = node.source.value;

        // Only check imports from @factorialco/factorial-one-react
        if (value === "@factorialco/factorial-one-react") {
          const importSpecifiers = node.specifiers || [];

          importSpecifiers.forEach((specifier) => {
            if (specifier.type === "ImportSpecifier") {
              const importedName =
                specifier.imported?.name || specifier.local?.name;

              if (
                RESTRICTED_COMPONENTS.includes(importedName) &&
                !isInAllowedFolder
              ) {
                context.report({
                  node: specifier,
                  message: `Importing "${importedName}" from '@factorialco/factorial-one-react' is not allowed outside the "${ALLOWED_FOLDER}" folder. Use UpsellingKit components from "modules/upselling_kit/components" instead.`,
                });
              }
            }
          });
        }
      },

      JSXOpeningElement(node) {
        if (
          node.name?.type === "JSXIdentifier" &&
          RESTRICTED_COMPONENTS.includes(node.name.name) &&
          !isInAllowedFolder
        ) {
          context.report({
            node,
            message: `Using "${node.name.name}" from '@factorialco/factorial-one-react' is not allowed outside the "${ALLOWED_FOLDER}" folder. Use UpsellingKit components from "modules/upselling_kit/components" instead.`,
          });
        }
      },

      CallExpression(node) {
        if (
          node.callee?.type === "MemberExpression" &&
          node.callee.object?.name === "React" &&
          node.callee.property?.name === "createElement" &&
          node.arguments[0]?.type === "Identifier" &&
          RESTRICTED_COMPONENTS.includes(node.arguments[0].name) &&
          !isInAllowedFolder
        ) {
          context.report({
            node,
            message: `Using "${node.arguments[0].name}" from '@factorialco/factorial-one-react' is not allowed outside the "${ALLOWED_FOLDER}" folder. Use UpsellingKit components from "modules/upselling_kit/components" instead.`,
          });
        }
      },
    };
  },
};

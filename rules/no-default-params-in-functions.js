module.exports = {
    create(context) {
        function checkDefaultParams(node) {
            if (!node.params || node.params.length === 0) return;

            let totalDefaults = 0;

            for (const param of node.params) {
                // Check if the parameter itself has a default value (AssignmentPattern)
                if (param.type === 'AssignmentPattern') {
                    totalDefaults++;
                }
                // Check for destructuring patterns with defaults
                else if (param.type === 'ObjectPattern') {
                    const destructuringDefaults = param.properties.filter(
                        (prop) =>
                            prop.value &&
                            prop.value.type === 'AssignmentPattern'
                    ).length;
                    totalDefaults += destructuringDefaults;
                } else if (param.type === 'ArrayPattern') {
                    const destructuringDefaults = param.elements.filter(
                        (element) =>
                            element && element.type === 'AssignmentPattern'
                    ).length;
                    totalDefaults += destructuringDefaults;
                }
            }

            if (totalDefaults > 1) {
                context.report({
                    node,
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                });
            }
        }

        return {
            FunctionDeclaration: checkDefaultParams,
            FunctionExpression: checkDefaultParams,
            ArrowFunctionExpression: checkDefaultParams,
        };
    },
};

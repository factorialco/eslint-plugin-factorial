# eslint-plugin-factorial

Factorial Eslint rules

# eslint-plugin-factorial

This is `eslint-plugin-factorial`, a set of custom ESLint rules designed to enhance code quality and enforce best practices in projects. It is ideal for projects that seek to maintain high standards of code clarity and consistency, particularly in the context of JavaScript and TypeScript development.

## Installation

First, you need to install [ESLint](http://eslint.org):

```bash
npm install eslint --save-dev
```

Next, install eslint-plugin-factorial:

```bash
npm install eslint-plugin-factorial --save-dev
```

## Usage
Add factorial to the plugins section of your .eslintrc configuration file. You can omit the eslint-plugin- prefix:

```json
{
  "plugins": [
    "factorial"
  ]
}
```

Then configure the rules you want to use under the rules section:


```json
{
  "rules": {
    "factorial/rule-name": 2
  }
}
```
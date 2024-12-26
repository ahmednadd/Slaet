export default {
  parser: "babel-eslint", // Use babel-eslint as the parser
  extends: [
    "eslint:recommended", // Use recommended rules from ESLint
    "plugin:react/recommended", // Use recommended rules from eslint-plugin-react
  ],
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ECMAScript features
    sourceType: "module", // Allow the use of imports
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the version of React
    },
  },
  rules: {
    // You can customize your rules here
    "react/prop-types": "off", // Disable prop-types rule
    "no-unused-vars": ["warn"], // Warns about unused variables
    "no-unused-imports": "error", // Error for unused imports
  },
};

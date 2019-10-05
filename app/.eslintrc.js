module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "no-var": [
        "error"
      ],
      "no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_" }
      ]
    }
};
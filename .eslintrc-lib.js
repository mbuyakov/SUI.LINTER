const origin = require("@sui/linter/.eslintrc.js");

const nri = origin.rules['no-restricted-imports'];
nri[1].patterns = nri[1].patterns.filter(it => !it.startsWith("@sui") && !it.startsWith("!@sui")); // Disable all sui rules
nri[1].patterns.push("@sui/all"); // And restrict "all" package
nri[1].patterns.push("@sui/all/*");

module.exports = {
  ...origin,
  "rules": {
    ...origin.rules,
    "no-restricted-imports": nri,
    "no-use-before-define": [0],
    "camelcase": [0],
    "no-console": [0]
  }
}

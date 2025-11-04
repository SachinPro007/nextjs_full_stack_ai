const path = require("path");

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`;

const buildTscCommand = () => `tsc`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames.join(" ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    buildEslintCommand,
    buildTscCommand,
    buildPrettierCommand,
  ],
};

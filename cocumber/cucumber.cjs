process.env.TS_NODE_PROJECT = require("path").resolve(__dirname, "tsconfig.json");
process.env.TS_NODE_TRANSPILE_ONLY = "true";

module.exports = {
  default: {
    publishQuiet: true,
    requireModule: ["ts-node/register"],
    require: [
      "features/support/**/*.ts",
      "features/steps/**/*.ts"
    ],
    paths: ["features/**/*.feature"],
    format: [
      "message:reports/cucumber.ndjson",
      "html:reports/cucumber.html"
    ],
    formatOptions: {
      snippetInterface: "async-await"
    },
    worldParameters: {}
  }
};

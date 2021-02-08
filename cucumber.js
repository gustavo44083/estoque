const fs = require("fs");

let worldParameters = {};
const e2eConfigPath = "e2e-config.json";
if (fs.existsSync(e2eConfigPath)) {
  worldParameters = JSON.parse(fs.readFileSync(e2eConfigPath, "utf8"));
}

const reportPath = "tests/reports";
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(`${reportPath}/error`, {recursive: true});
}

worldParameters['reportPath'] = reportPath

const feature = [
  "--require-module ts-node/register",
  "--require features/**/*.ts",
  `--format ${
    process.env.CI || !process.stdout.isTTY ? "progress" : "progress-bar"
  }`,
  `--format rerun:${reportPath}/@rerun.txt`,
  `--format usage:${reportPath}/usage.txt`,
  `--format message:${reportPath}/messages.ndjson`,
  `--world-parameters '${JSON.stringify(worldParameters)}'`,
  "--publish-quiet",
].join(" ");

console.log(feature)

module.exports = {
  default: feature,
};

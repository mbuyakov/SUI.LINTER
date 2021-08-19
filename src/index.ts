import {resolve} from "path";
import {ESLint} from "eslint";
import {getFiles} from "./utils/fs";
import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";

const options = yargs(hideBin(process.argv)).options({
  fix: { type: 'boolean' },
  quiet: { type: 'boolean' },
}).parseSync();

(async function main() {
  let rootDir = process.cwd();
  let srcDir = process.env.SRC_DIR;


  if (!srcDir) {
    console.log("SRC_DIR env not specified, use default");
    srcDir = "src";
  }

  srcDir = resolve(`${rootDir}/${srcDir}`);

  console.log(`Source directory: ${srcDir}`);

  const files = [];
  for await (const f of getFiles(srcDir)) {
    if (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".jsx")) {
      files.push(f);
    }
  }
  console.log(`Total files: ${files.length}`);

  const eslint = new ESLint({
    cache: true,
    fix: options.fix
  });
  let results = await eslint.lintFiles(files);
  const errors = ESLint.getErrorResults(results);

  if (options.quiet) {
    console.log("Quiet mode enabled - filtering out warnings");
    results = errors;
  }

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(resultText);

  if (errors.length > 0) {
    process.exitCode = 1;
  }

})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});

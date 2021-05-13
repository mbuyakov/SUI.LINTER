import {resolve} from "path";
import {ESLint} from "eslint";
import {getFiles} from "./utils/fs";


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
        if(f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".jsx")) {
            files.push(f);
        }
    }
    console.log(`Total files: ${files.length}`);
    // const configPath = path.resolve(`${rootDir}/.eslintrc.js`);
    // const eslintConfig = require(configPath);
    // console.log(eslintConfig);
    const eslint = new ESLint({
        cache: true
    });
    const results = await eslint.lintFiles(files);
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
    console.log(resultText);

})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});

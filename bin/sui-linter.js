#!/usr/bin/env node
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
  }
});
require("../src/index");

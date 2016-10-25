#!/usr/bin/env node
"use strict";

const execSync = require('child_process').execSync;
const path = require('path');
const args = process.argv.splice(2);
const fs = require('fs');

let execCommand = '';
let opts = [];
let packages = [];

for (let i = 0, len = args.length; i < len; i++) {
  let arg = args[i];
  if (arg.indexOf('-') === 0) {
    opts.push(arg);
  } else {
    packages.push(arg);
  }
}

// 如果是 -all， 则读取文件夹目录下所有modules。否则使用参数。
const allIndex = opts.indexOf('-all');
if (allIndex !== -1) {
  opts.splice(allIndex, 1);
  packages = fs.readdirSync(`${process.cwd()}\\node_modules`);
}

packages = packages.filter(function(v) {
  if (v.indexOf('.') !== 0)
    return v;
});

const packagesLength = packages.length;
const uninstallCount = 50;
let uninstallTimes = 1;
if (packagesLength === 0 ) {
  console.log('已全部删除');
  return;
}

if (packagesLength > uninstallCount) {  // 依赖书多以约定，分批进行
  uninstallTimes = parseInt((packagesLength - 1) / uninstallCount) + 1;
}
console.log(`共删除 ${packages.length} 个modules, 分${uninstallTimes}批进行删除: `);

while(uninstallTimes > 0) {
  uninstallTimes--;
  execCommand = `npm un ${packages.splice(0, uninstallCount).join(' ')} ${opts.join(' ')}`;
  console.log(`运行命令：\n${execCommand}`);
  execSync(execCommand);
}

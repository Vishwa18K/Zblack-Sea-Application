const { getAsset, getRawAsset } = require('node:sea');
const fs = require('fs');
const { createRequire } = require('module');
const originalRequire = require;
const requireFromDisk = createRequire(__filename);
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

global.require = (name) => {
  try {
    return originalRequire(name);
  } catch {
    return requireFromDisk(name);
  }
};



for (const ele of process.argv) {
  if (ele === "--inspect" || ele === "--inspect-brk") {
    try {
      const inspector = require('inspector');
      inspector.open(9229, '127.0.0.1', true);
      if (ele === "--inspect-brk") {
        debugger;
      }
    } catch (e) {
      console.error('Error', e);
    }
  }
}

//  Debugger test code  //
function add(a, b) {
  debugger;
  return a + b;
}
debugger;
for (let i = 0; i < 3; i++) {
  const result = add(i, i * 2);
  console.log(`add(${i}, ${i * 2}) = ${result}`);
}

//  Debugger test code  //
debugger;
function add(a, b) {
  return a + b;
}

for (let i = 0; i < 3; i++) {
  debugger;
  const result = add(i, i * 2);
  console.log(`add(${i}, ${i * 2}) = ${result}`);
}
//  End Debugger test code //

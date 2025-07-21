// const { getAsset, getRawAsset } = require('node:sea');
// const fs = require('fs');
// const { createRequire } = require('module');
// const originalRequire = require;
// const requireFromDisk = createRequire(__filename);
// const { spawn } = require('child_process');
// const path = require('path');


console.log("hello")
debugger;
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
debugger;
const hour = 18
if (hour === 18) {
  greeting = "Good day";
}
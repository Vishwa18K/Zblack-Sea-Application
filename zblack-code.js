const { getAsset, getRawAsset } = require('node:sea');
const fs = require('fs');
const { createRequire } = require('module');
const originalRequire = require;
const requireFromDisk = createRequire(__filename);
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');


function LocalOrGlobal(binName) {
  const localPath = path.join(process.cwd(), binName);
  return fs.existsSync(localPath) ? localPath : binName;
}

// Override global.require to use LocalOrGlobal for module resolution
global.require = (name) => {
  try {
    // Try to LocalOrGlobal as a local file/module first
    return originalRequire(LocalOrGlobal(name));
  } catch {
    // Fallback to requireFromDisk with the same logic
    return requireFromDisk(LocalOrGlobal(name));
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
//  End Debugger test code //


function transpileZ3ToJS(z3Code) {
    //dummy code can be used to test the transpiler.
    //is called below in if statement.
  return z3Code;
}


let wantsZblackOnly = false;
let buffer = getAsset('b.txt', 'utf8');
let jsFileToRun = null;

const zblackPath = LocalOrGlobal('zblack-win-x64.exe');

for (const arg of process.argv) {
  if (arg === '--zblack-only') {
    wantsZblackOnly = true;
  }
  else if (arg.endsWith('.z3')) {
    jsFileToRun = arg;
  }
}

if (wantsZblackOnly && buffer) {
  try {
    const child = spawn(zblackPath, [], {
      stdio: ['pipe', 'inherit', 'inherit']
    });
    child.stdin.write(buffer);
    child.stdin.end();
    child.on('exit', (code) => {
      console.log(`zblack successfully exited. Code: ${code}`);
    });
  } catch (err) {
    console.error(`Error running zblack with file ${buffer}:`, err.message);
  }
} else if (!wantsZblackOnly && jsFileToRun) {
  try {
    const jsCode = transpileZ3ToJS(buffer);
    let codeToExecute = jsCode;
    const tmp = require('os').tmpdir();
    const tmpFile = path.join(tmp, `z3-transpiled-${Date.now()}.js`);
    fs.writeFileSync(tmpFile, jsCode, 'utf8');
    const child = spawn(process.execPath, [tmpFile], {
      stdio: 'inherit'
    });
    child.on('exit', (code) => {
      fs.unlinkSync(tmpFile);
      process.exit(code);
    });
    return;
  } catch (err) {
    console.error(`Error running transpiled JS:`, err.message);
  }
}
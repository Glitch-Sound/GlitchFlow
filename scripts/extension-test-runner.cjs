const { resolve } = require("node:path");
const Mocha = require("mocha");

function run() {
  return new Promise((resolveRun, rejectRun) => {
    const mocha = new Mocha({ ui: "tdd", timeout: 30000 });
    mocha.addFile(
      resolve(__dirname, "../dist/extension-tests/preview.test.js"),
    );
    mocha.addFile(
      resolve(__dirname, "../dist/extension-tests/diagnostics.test.js"),
    );
    mocha.addFile(
      resolve(__dirname, "../dist/extension-tests/syntax-colors.test.js"),
    );
    mocha.addFile(
      resolve(__dirname, "../dist/extension-tests/completion.test.js"),
    );
    mocha.run((failures) => {
      if (failures === 0) resolveRun();
      else rejectRun(new Error(`${failures} extension test(s) failed`));
    });
  });
}

module.exports = { run };

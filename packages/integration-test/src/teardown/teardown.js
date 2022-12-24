module.exports = function () {
  var exec = require("child_process").exec

  exec('ps all', (_, stdout) => {
    console.log(stdout);
  })

  // globalThis.__emulator__.pid is not the pid of the flow process, but the shell!
  exec('pgrep -f "flow emulator"', (_, stdout, stderr) => {
    const flowPid = parseInt(stdout);
    console.log('flowPid: ', flowPid);
    process.kill(flowPid)
  })
};
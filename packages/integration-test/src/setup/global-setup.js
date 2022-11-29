module.exports = async function () {
  var exec = require("child_process").exec

  const restPort = 8888
  const adminPort = 8080
  const grpcPort = 3569
  const cmd = `flow emulator --rest-port=${restPort} --admin-port=${adminPort} --port=${grpcPort}`

  globalThis.__emulator__ = exec(cmd, function (error, stdout, stderr) {
    // This will log emulator output at the end
    // console.log("stdout: " + stdout)
    // console.log("stderr: " + stderr)
    if (error !== null) {
      console.log("Emulator error: " + error)
    }
  })
}

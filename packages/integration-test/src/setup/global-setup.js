module.exports = async function () {
  var exec = require("child_process").exec
  var waitOn = require('wait-on');

  const restPort = 8888
  const adminPort = 8080
  const grpcPort = 3569
  const cmd = `flow emulator --rest-port=${restPort} --admin-port=${adminPort} --port=${grpcPort} &`

  console.log('Launching emulator');

  globalThis.__emulator__ = exec(cmd, function (error, stdout, stderr) {
    // This will log emulator output at the end
    // console.log("stdout: " + stdout)
    // console.log("stderr: " + stderr)
    if (error !== null) {
      console.log("Emulator error: " + error)
    }
  })

  try {
    await waitOn({
      resources: [
        `tcp:127.0.0.1:${restPort}`,
        `tcp:127.0.0.1:${adminPort}`,
        `tcp:127.0.0.1:${grpcPort}`,
      ],
      log: true
    })
  } catch (err) {
    console.log('Error waiting for port');
  }

}

const {watch} = require("rollup")
const {EventEmitter} = require("events")

module.exports = function WatcherFactory(numWatchers) {
  this.watchers = []
  this.eventEmitter = new EventEmitter()
  this.eventBuffers = {}
  this.numWatchers = numWatchers

  this.makeWatcher = watchOptions => {
    const watcher = watch(watchOptions)
    this.watchers.push(watcher)

    watcher.on("event", event => {
      const {code} = event

      switch (code) {
        case "ERROR":
          console.error("Build failed!", event.error)
          break
      }

      if (!this.eventBuffers[code]) this.eventBuffers[code] = new EventBuffer()
      this.eventBuffers[code].put(watcher, event)

      if (this.eventBuffers[code].size >= numWatchers) {
        this.eventEmitter.emit("event", {
          code,
          events: this.eventBuffers[code],
        })
        this.eventBuffers[code].clear()
      }
    })

    return watcher
  }
}

function EventBuffer() {
  this.events = []
  this.get = watcher => this.events.find(evt => evt.watcher === watcher)?.event
  this.put = (watcher, event) =>
    this.events.push({
      watcher,
      event,
    })
  this.clear = () => (this.events = [])
  Object.defineProperty(this, "size", {
    get() {
      return this.events.length
    },
  })
}

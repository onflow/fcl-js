const {watch} = require("rollup")
const {EventEmitter} = require("events")

class WatcherPool extends EventEmitter {
  constructor(watcherOptionsList) {
    super()
    this.numWatchers = watcherOptionsList.length
    this.watchers = []
    this.eventBuffers = {}

    watcherOptionsList.forEach(watcherOptions =>
      this.addWatcher(watcherOptions)
    )
  }

  addWatcher(watcherOptions) {
    const watcher = watch(watcherOptions)
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

      if (this.eventBuffers[code].size >= this.numWatchers) {
        this.emit("event", {
          code,
          events: this.eventBuffers[code],
        })
        this.eventBuffers[code].clear()
      }
    })

    return watcher
  }
}

class EventBuffer {
  events = []

  get(watcher) {
    return this.events.find(evt => evt.watcher === watcher)?.event
  }

  put(watcher, event) {
    return this.events.push({
      watcher,
      event,
    })
  }

  clear() {
    this.events = []
  }

  get size() {
    return this.events.length
  }
}

module.exports = WatcherPool

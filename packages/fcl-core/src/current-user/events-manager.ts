import {CurrentUser, Service, StreamConnection} from "@onflow/typedefs"
import EventEmitter from "events"
import {execService} from "./exec-service"
import {
  StreamInfo,
  streamConnectorManager,
} from "./exec-service/streams/stream-connector-manager"

export enum EventTypes {
  AUTHN_REFRESH = "authn-refresh",
}

export type WalletEvent = {
  type: EventTypes
}

const SUBSCRIBE_EVENTS_SERVICE_TYPE = "subscribe-events"

class EventsManager extends EventEmitter {
  private stream: Promise<StreamConnection<{message: any}>> | null = null
  private service: Service | null = null

  constructor(
    private platform: string,
    private subscribeCurrentUser: (
      fn: (user: CurrentUser | null) => void
    ) => void
  ) {
    super()
    this.watchCurrentUser()
  }

  // Watch the current user to maintain a connection to the events service
  private watchCurrentUser() {
    this.subscribeCurrentUser((currentUser: CurrentUser | null) => {
      function findSubscribeEventsService() {
        if (!currentUser?.loggedIn) {
          return null
        }

        const service = (currentUser.services as Service[]).find(
          s => s.type === SUBSCRIBE_EVENTS_SERVICE_TYPE
        )
        if (!service) {
          return null
        }

        return service
      }

      // Only update the connection if the service has changed
      const service = findSubscribeEventsService()
      if (JSON.stringify(service) !== JSON.stringify(this.service)) {
        this.service = service
        this.subscribe(service)
      }
    })
  }

  private async subscribe(service: Service | null) {
    // Close the connection if the service is null
    if (!service) {
      this.close()
    }

    // Create a new connection
    const newStream = execService({
      service,
      config: {},
      opts: {},
      platform: this.platform,
    })
      .then((streamInfo: StreamInfo) => {
        // Connect to the stream using the appropriate connector
        return streamConnectorManager.connect(streamInfo)
      })
      .then((stream: StreamConnection<any>) => {
        // Attach the event listener once the stream is ready
        stream.on("message", (data: WalletEvent) => {
          this.emit(data.type, data)
        })
        return stream
      })

    // Close the previous connection & update the stream
    this.close()
    this.stream = newStream
  }

  // Close the current connection
  close() {
    if (this.stream) {
      this.stream.then(stream => stream.close())
      this.stream = null
    }
  }
}

let eventsManager: EventsManager | null = null

export function initEventsManager(
  platform: string,
  subscribeCurrentUser: (fn: (user: CurrentUser | null) => void) => void
) {
  eventsManager = new EventsManager(platform, subscribeCurrentUser)
}

// Get the events manager singleton
export function getEventsManager() {
  if (!eventsManager) {
    throw new Error("EventsManager not initialized")
  }
  return eventsManager
}

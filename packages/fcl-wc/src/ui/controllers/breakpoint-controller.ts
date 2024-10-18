import {ReactiveControllerHost, ReactiveController} from "lit"
import {property} from "lit/decorators.js"

interface BreakpointMap {
  [key: string]: number
}

export class BreakpointController implements ReactiveController {
  private host: ReactiveControllerHost

  _onMouseMove = ({clientX, clientY}: MouseEvent) => {}

  constructor(host: ReactiveControllerHost) {
    this.host = host
  }

  @property()
  breakpoints: BreakpointMap = {}

  hostConnected() {
    window.addEventListener("mousemove", this._onMouseMove)
  }

  hostDisconnected() {
    window.removeEventListener("mousemove", this._onMouseMove)
  }
}

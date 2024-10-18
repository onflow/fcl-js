import {css, LitElement} from "lit"
import {html} from "lit/static-html.js"
import {property, state} from "lit/decorators.js"
import {unsafeStatic} from "lit/static-html.js"
import {getScopedTagName} from "../util/scoped-element"
import {Dialog} from "./Dialog"
import {Drawer} from "./Drawer"

const DialogTag = unsafeStatic(getScopedTagName(Dialog))
const DrawerTag = unsafeStatic(getScopedTagName(Drawer))

enum ModalType {
  Drawer = "drawer",
  Dialog = "dialog",
}

// DO NOT USE DECORATORS!  THERE IS A BUG IN BABEL THAT WILL BREAK THE BUILD
// The suggested workarounds do not work.  It's not worth the effort right now.
// It's a symptom of lit using very new features of decorators that are not
// supported well in Babel/Rollup yet.

export class AdaptiveModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      visibility: hidden;
      opacity: 0;
      transition:
        visibility 0s,
        opacity 0.3s ease;
    }
    .modal-overlay[open] {
      visibility: visible;
      opacity: 1;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      gap: 2rem;
      padding: 2rem;
      border-radius: 0.5rem;
      max-width: 24rem;
      width: 100%;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    @media only screen and (max-width: 600px) {
      .modal-content {
        width: 90vw;
        max-width: 90vw;
      }
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      position: absolute;
      top: 10px;
      right: 15px;
      cursor: pointer;
    }
  `

  @property()
  accessor open: boolean = false

  @state()
  private accessor modalType: ModalType = ModalType.Dialog

  private close() {
    this.open = false
    this.dispatchEvent(new CustomEvent("close"))
  }

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {}

  render() {
    if (this.modalType === "dialog") {
      return html`
        <${DialogTag} class="modal-overlay" ?open="${this.open}">
        </${DialogTag}>
      `
    }
  }
}

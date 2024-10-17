import {css, html, LitElement} from "lit"
import {property} from "lit/decorators.js"
import {createElement} from "./util/create-element"
import {getScopedTagName} from "./util/scoped-element"

// DO NOT USE DECORATORS!  THERE IS A BUG IN BABEL THAT WILL BREAK THE BUILD
// The suggested workarounds do not work.  It's not worth the effort right now.
// It's a symptom of lit using very new features of decorators that are not
// supported well in Babel yet.

export class ConfirmationPrompt extends LitElement {
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
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    @media only screen and (max-width: 600px) {
      .modal-content {
        width: 90%;
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

  @property()
  accessor walletName: string = ""

  private close() {
    this.open = false
    this.dispatchEvent(new CustomEvent("close"))
  }

  render() {
    return html`
      <div class="modal-overlay" ?open="${this.open}">
        <div class="modal-content">
          <button class="close-btn" @click="${this.close}">&times;</button>
          <div>
            <h2>Pending Approval</h2>
            <p>
              Please confirm the transaction in your ${this.walletName} wallet.
            </p>
          </div>
        </div>
      </div>
    `
  }
}

let deepLinkModal: ConfirmationPrompt | null = null

export function getConfirmationPrompt() {
  if (deepLinkModal == null) {
    deepLinkModal = createElement(ConfirmationPrompt, new Map())
    deepLinkModal.open = false
    document.body.appendChild(deepLinkModal)
  }
  return deepLinkModal
}

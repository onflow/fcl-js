import {css, LitElement} from "lit"
// TODO, lets work around this without static html.  If we can also get type safety in the process, that would be great.
import {html, unsafeStatic} from "lit/static-html.js"
import {property} from "lit/decorators.js"
import {createElement, defineElement} from "./util/create-element"
import {Provider} from "@onflow/typedefs"
import {LoadingDots} from "./LoadingDots"
import {getScopedTagName} from "./util/scoped-element"

import browserImage from "./assets/browser.png"
import mobileImage from "./assets/mobile.png"

// DO NOT USE DECORATORS!  THERE IS A BUG IN BABEL THAT WILL BREAK THE BUILD
// The suggested workarounds do not work.  It's not worth the effort right now.
// It's a symptom of lit using very new features of decorators that are not
// supported well in Babel/Rollup yet.

export class ConfirmationPrompt extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
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

    .icon {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 17.543859649%;
      border: 1px solid #aaa;
    }

    .icon-container {
      display: flex;
      width: 16rem;
      justify-content: space-between;
      align-items: center;
    }

    .lower-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h2 {
      padding: 0;
      margin: 0;
    }

    .text-small {
      font-size: 0.8rem;
    }

    .text-regular {
      font-weight: normal;
    }

    .text-bold {
      font-weight: bold;
    }

    .try-again {
      color: #007bff;
      cursor: pointer;
    }
  `

  @property()
  accessor open: boolean = false

  @property()
  accessor initiatorIcon: string | null = null

  @property()
  accessor provider: Provider | null = null

  private close() {
    this.open = false
    this.dispatchEvent(new CustomEvent("close"))
  }

  private tryAgain() {
    this.dispatchEvent(new CustomEvent("try-again"))
  }

  render() {
    const staticTag = getScopedTagName(LoadingDots)
    console.log(staticTag)
    return html`
      <div class="modal-overlay" ?open="${this.open}">
        <div class="modal-content">
          <button class="close-btn" @click="${this.close}">&times;</button>
          <h2 class="text-regular">Please Confirm in Wallet</h2>

          <div class="icon-container">
            <img src="${this.initiatorIcon || browserImage}" class="icon" alt="Browser" />
            <${unsafeStatic(staticTag)}></${unsafeStatic(staticTag)}>
            <img
              src="${this.provider?.icon || mobileImage}"
              class="icon"
              alt="${this.provider?.name || "Wallet Icon"}"
            />
          </div>

          <div class="lower-content">
            <span>
              There is a pending request to the <span class="text-bold">${this.provider?.name}</span> app on your device.
            </span>
            <span class="text-small">
              No prompt on your device? <span class="try-again" @click="${this.tryAgain}">Try again</span>
            </span>
          </div>
        </div>
      </div>
    `
  }
}

let deepLinkModal: ConfirmationPrompt | null = null

export function getConfirmationPrompt() {
  defineElement(LoadingDots)

  if (deepLinkModal == null) {
    deepLinkModal = createElement(ConfirmationPrompt, new Map())
    document.body.appendChild(deepLinkModal)
  }
  return deepLinkModal
}

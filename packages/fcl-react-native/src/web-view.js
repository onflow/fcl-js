import { uid } from "@onflow/util-uid"
import { WebView } from "react-native-webview";
import { useRef, createElement } from "react";
import { buildMessageHandler } from './utils'
import { VERSION, normalizePollingResponse } from "@onflow/fcl";

export const WebViewHandler = ({ service, body, config, opts, onClose, resolve, reject }) => {
  const id = uid()
  const includeOlderJsonRpcCall = opts.includeOlderJsonRpcCall
  const { endpoint } = service
  const webViewRef = useRef(null);

  function close() {
    try {
      webViewRef.current.injectJavaScript(`
        window.removeEventListener("message", (event) => window.ReactNativeWebView.postMessage(event));
        true;
      `)
      onClose()
    } catch (error) {
      console.error("Tab Close Error", error)
    }
  }

  const send = (msg) => {
    webViewRef.current.injectJavaScript(`
      window.postMessage(
        ${JSON.stringify(msg || {})}
      , "*");
      true;
    `);
  };

  const onReady = () => {
    try {
      send({
        type: "FCL:VIEW:READY:RESPONSE",
        fclVersion: VERSION,
        body,
        service: {
          params: service.params,
          data: service.data,
          type: service.type,
        },
        config,
      });
      send({
        fclVersion: VERSION,
        type: "FCL:FRAME:READY:RESPONSE",
        body,
        service: {
          params: service.params,
          data: service.data,
          type: service.type,
        },
        config,
        deprecated: {
          message:
            "FCL:FRAME:READY:RESPONSE is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE",
        },
      });
      if (includeOlderJsonRpcCall) {
        send({
          jsonrpc: "2.0",
          id: id,
          method: "fcl:sign",
          params: [service.params],
          deprecated: {
            message:
              "jsonrpc is deprecated and replaced with type: FCL:VIEW:READY:RESPONSE",
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const onResponse = (e, { close }) => {
    try {
      if (typeof e.data !== "object") return;
      const resp = normalizePollingResponse(e.data);

      switch (resp.status) {
        case "APPROVED":
          resolve(resp.data);
          close();
          break;

        case "DECLINED":
          reject(`Declined: ${resp.reason || "No reason supplied"}`);
          close();
          break;

        case "REDIRECT":
          resolve(resp);
          close();
          break;

        default:
          reject(`Declined: No reason supplied`);
          close();
          break;
      }
    } catch (error) {
      console.error("WebView onResponse error", error);
      throw error;
    }
  };

  const onMessage = (e, { close }) => {
    try {
      if (typeof e.data !== "object") return;
      if (e.data.jsonrpc !== "2.0") return;
      if (e.data.id !== id) return;
      const resp = normalizePollingResponse(e.data.result);

      switch (resp.status) {
        case "APPROVED":
          resolve(resp.data);
          close();
          break;

        case "DECLINED":
          reject(`Declined: ${resp.reason || "No reason supplied"}`);
          close();
          break;

        case "REDIRECT":
          resolve(resp);
          close();
          break;

        default:
          reject(`Declined: No reason supplied`);
          close();
          break;
      }
    } catch (error) {
      console.error("WebView onMessage error", error);
      throw error;
    }
  };

  const handler = buildMessageHandler({
    close,
    send,
    onReady,
    onResponse,
    onMessage,
  })

  return createElement(WebView, {ref: webViewRef,
    source: { uri: endpoint },
    onMessage: handler,
    javaScriptEnabled: true,
    injectedJavaScriptBeforeContentLoaded: `
      window.addEventListener("message", (event) => window.ReactNativeWebView.postMessage(JSON.stringify(event.data)));
      true;
    `
  })
};

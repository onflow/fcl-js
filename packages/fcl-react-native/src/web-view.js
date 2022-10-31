import { WebView } from "react-native-webview";
import { useRef, useEffect } from "react";

export const WebViewHandler = ({ service, endpoint = "", handleClose }) => {
  const webViewRef = useRef(null);

  useEffect(() => {
    webViewRef.current.injectJavaScript(
      `window.addEventListener("message", (event) => window.ReactNativeWebView.postMessage(event)));`
    );
  }, []);

  useEffect(() => {
    webViewRef.current.injectJavaScript(
      `window.ReactNativeWebView.postMessage("test1");`
    );
  }, []);

  const onClose = () => {
    handleClose();
  };

  const send = (msg) => {
    webViewRef.current.injectJavaScript(
      `window.postMessage(
        ${JSON.stringify(msg || {})}
      , "*");`
    );
  };

  const onReady = () => {
    try {
      send({
        type: "FCL:VIEW:READY:RESPONSE",
        fclVersion: "1.0.0",
        body,
        service: {
          params: service.params,
          data: service.data,
          type: service.type,
        },
        config,
      });
      send({
        fclVersion: "1.0.0",
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
          params: [body, service.params],
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
      console.error("execIframeRPC onResponse error", error);
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
      console.error("execIframeRPC onMessage error", error);
      throw error;
    }
  };

  console.log("RENDER WEB VIEW");

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: endpoint }}
      onMessage={(message) => {
        console.log("message from webview", message);
      }}
    ></WebView>
  );
};

import { bus_reply_stream, bus_request_stream } from "@/types";

// Send message to WebSocket via background
function sendToWebSocket(data: any) {
  browser.runtime.sendMessage({
    type: "SEND_WS_MESSAGE",
    data,
  });
}

export default defineContentScript({
  matches: ["*://app.diagrams.net/*", "*://www.baidu.com/*"],
  async main() {
    console.log("Hello content " + Date.now(), { window, browser });
    await injectScript("/main_world.js");

    // Listen for messages from background
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "WS_MESSAGE") {
        console.log(
          "[content] Received from background from WebSocket:",
          message.data,
        );
        window.dispatchEvent(
          new CustomEvent(bus_request_stream, { detail: message.data }),
        );
      } else if (message.type === "WS_STATUS") {
        console.log(
          "WebSocket status:",
          message.connected ? "Connected" : "Disconnected",
        );
      }
    });

    window.addEventListener(bus_reply_stream, (message: any) => {
      console.log("[content] reply received", message);
      const reply = message.detail;
      if (reply === undefined || reply === null) {
        console.warn(
          `[content] suspicious empty message detail received`,
          message,
        );
      }
      sendToWebSocket(reply);
    });
  },
});

async function injectScript(path: string) {
  const url = browser.runtime.getURL(path);
  const script = document.createElement("script");
  if (browser.runtime.getManifest().manifest_version === 2) {
    script.innerHTML = await fetch(url).then((res) => res.text());
  } else {
    script.src = url;
  }
  (document.head ?? document.documentElement).append(script);
}

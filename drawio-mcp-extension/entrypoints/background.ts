export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds
  let currentConnectionState: "disconnected" | "connecting" | "connected" =
    "disconnected";

  setExtensionIcon("disconnected");

  function setExtensionIcon(state: typeof currentConnectionState) {
    currentConnectionState = state;
    const iconSizes = [16, 32, 48, 128];
    const iconPaths = iconSizes.reduce(
      (acc, size) => ({
        ...acc,
        [size]: `/icon/logo_${state}_${size}.png`,
      }),
      {},
    );

    const browserAction = browser.browserAction
      ? browser.browserAction
      : browser.action;
    browserAction.setIcon({ path: iconPaths });

    // Notify popup about connection state change
    browser.runtime
      .sendMessage({
        type: "CONNECTION_STATE_UPDATE",
        state: currentConnectionState,
      })
      .catch(() => {
        // Ignore errors - popup might not be open
      });
  }

  function connect() {
    setExtensionIcon("connecting");

    socket = new WebSocket("ws://localhost:3333");

    socket.addEventListener("open", (event) => {
      console.debug("[background] WebSocket connection established", event);
      reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      setExtensionIcon("connected");
      broadcastToContentScripts({ type: "WS_STATUS", connected: true });
    });

    socket.addEventListener("message", (event) => {
      console.debug("[background] Message from server:", event.data);
      const json = JSON.parse(event.data);
      broadcastToContentScripts({
        type: "WS_MESSAGE",
        data: json,
      });
    });

    socket.addEventListener("close", (event) => {
      console.debug("[background] WebSocket connection closed", event);
      setExtensionIcon("disconnected");
      broadcastToContentScripts({ type: "WS_STATUS", connected: false });
      attemptReconnect();
    });

    socket.addEventListener("error", (event) => {
      console.error("[background] WebSocket error:", event);
      setExtensionIcon("disconnected");
    });
  }

  function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      // Exponential backoff with some randomness
      const delay =
        reconnectDelay * Math.pow(1.5, reconnectAttempts) +
        Math.random() * 1000;
      setExtensionIcon("connecting");
      console.log(
        `Attempting to reconnect in ${delay / 1000} seconds... (attempt ${
          reconnectAttempts
        })`,
      );
      setTimeout(() => {
        connect();
      }, delay);
    } else {
      console.error("Max reconnection attempts reached. Giving up.");
      setExtensionIcon("disconnected");
    }
  }

  async function broadcastToContentScripts(message: any) {
    const tabs = await browser.tabs.query({});
    console.debug(`[background] broadcast to tabs`, tabs);
    for (const tab of tabs) {
      if (tab.id) {
        // Only send to tabs that match our content script patterns
        if (
          tab.url?.startsWith("http://app.diagrams.net") ||
          tab.url?.startsWith("https://app.diagrams.net") ||
          tab.url?.startsWith("http://www.baidu.com") ||
          tab.url?.startsWith("https://www.baidu.com")
        ) {
          browser.tabs
            .sendMessage(tab.id, message)
            .catch((err) => {
              // Ignore errors - tab might not have content script loaded
            });
        }
      }
    }
  }

  // Listen for messages from content scripts
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.type === "SEND_WS_MESSAGE" &&
      socket?.readyState === WebSocket.OPEN
    ) {
      const ser = JSON.stringify(message.data);
      console.debug(`[background] received from content`, {
        received: message.data,
        sending: ser,
      });
      socket.send(ser);
    }

    if (message.type === "GET_CONNECTION_STATE") {
      console.debug("[background] Connection state requested by popup");
      sendResponse({ state: currentConnectionState });
    }

    if (message.type === "SEND_PING_TO_SERVER") {
      console.debug("[background] Sending ping to server");
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "Not connected to server" });
      }
    }

    if (message.type === "RECONNECT_TO_SERVER") {
      console.debug("[background] Reconnect requested by popup");
      // Reset reconnect attempts and connect
      reconnectAttempts = 0;
      if (socket) {
        socket.close();
      }
      connect();
      sendResponse({ success: true });
    }

    // Return true to indicate we will send a response asynchronously
    return true;
  });

  // Initial connection
  connect();
});

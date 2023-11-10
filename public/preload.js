// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
window.ipcRenderer = ipcRenderer;

contextBridge.exposeInMainWorld("loginWGauth", {
  send: (channel, data) => {
    // console.log(`Preload ${channel}, ${data}`);
    ipcRenderer.send(channel, data);
  },
  onDataFromElectron: (callback) => {
    ipcRenderer.on("data-from-electron", (event, data) => {
      callback(data);
    });
  },
});

// Expose ipcRenderer to the window object

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});

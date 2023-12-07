// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const ElectronGoogleOAuth2 =
  require("@getstation/electron-google-oauth2").default;
// const { shell } = require("electron");
let mainWindow;

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1200,
    minWidth: 800,
    minHeight: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      preload: __dirname + "/preload.js",
      nodeIntegration: true,
      nativeWindowOpen: true,
      webSecurity: false,
    },
    // titleBarStyle: "hiddenInset", // Hide the default title bar (macOS)
    backgroundColor: "rgba(231,231,231, 1)",
    icon: path.join(__dirname, "public/favicon.png"),
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  // const appURL = app.isPackaged
  //   ? url.format({
  //       pathname: path.join(__dirname, "index.html"),
  //       protocol: "file:",
  //       slashes: true,
  //     })
  //   : "http://localhost:3000";
  const appURL = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  });
  // mainWindow.loadURL(appURL);
  mainWindow.loadURL(
    !app.isPackaged
      ? "http://localhost:3000"
      : `file://${__dirname}/../build/index.html`
  );

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("call-my-function", (e, data) => {
  const myApiOauth = new ElectronGoogleOAuth2(
    "659220311316-1qh6kl8m9iamt58oh3dlgbg7j3qj93jh.apps.googleusercontent.com",
    "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",
    [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ]
  );

  myApiOauth.openAuthWindowAndGetTokens().then((token) => {
    mainWindow.webContents.send("data-from-electron", token.access_token);
  });
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
    //   event.preventDefault();
    // }
  });
});

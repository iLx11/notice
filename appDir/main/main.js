"use strict";
const electron = require("electron");
const path$2 = require("path");
const { ipcMain: ipcMain$1, BrowserWindow: BrowserWindow$1, screen: screen$1 } = require("electron");
const windowControlListener = () => {
  ipcMain$1.handle("get-screen-size", () => {
    const primaryDisplay = screen$1.getPrimaryDisplay();
    return primaryDisplay.size;
  });
  ipcMain$1.on("window-on-top", (event, state) => {
    const webContent = event.sender;
    const win = BrowserWindow$1.fromWebContents(webContent);
    win.setAlwaysOnTop(state);
  });
  ipcMain$1.on("window-min", (event) => {
    const webContent = event.sender;
    const win = BrowserWindow$1.fromWebContents(webContent);
    win.minimize();
  });
  ipcMain$1.on("window-max", (event, state, windowSize = {}) => {
    const webContent = event.sender;
    const win = BrowserWindow$1.fromWebContents(webContent);
    if (state) {
      const { width: screenWidth, height: screenHeight } = screen$1.getPrimaryDisplay().workAreaSize;
      const x = Math.round((screenWidth - windowSize.width) / 2);
      const y = Math.round((screenHeight - windowSize.height) / 2);
      win.setBounds({ ...windowSize, x, y });
    } else {
      win.maximize();
    }
  });
  ipcMain$1.on("window-close", (event) => {
    const webContent = event.sender;
    const win = BrowserWindow$1.fromWebContents(webContent);
    win.close();
  });
  ipcMain$1.on("window-hide", (event) => {
    const webContent = event.sender;
    const win = BrowserWindow$1.fromWebContents(webContent);
    win.hide();
  });
};
const path$1 = require("path");
const _CreateWindow = class _CreateWindow {
  constructor() {
    this.getWindowById = (id) => {
      return electron.BrowserWindow.fromId(id);
    };
    this.defaultConfig = {
      id: null,
      //唯一 id
      title: "",
      //窗口标题
      width: null,
      //宽度
      height: null,
      //高度
      minWidth: null,
      //最小宽度
      minHeight: null,
      //最小高度
      route: "",
      // 页面路由 URL '/manage?id=123'
      resizable: true,
      //是否支持调整窗口大小
      maximize: false,
      //是否最大化
      backgroundColor: "#eee",
      //窗口背景色
      data: null,
      //数据
      isMultiWindow: false,
      //是否支持多开窗口 (如果为 false，当窗体存在，再次创建不会新建一个窗体 只 focus 显示即可，，如果为 true，即使窗体存在，也可以新建一个)
      isMainWin: false,
      //是否主窗口创建父子窗口 --(当为 true 时会替代当前主窗口)
      parentId: null,
      //父窗口 id   子窗口永远显示在父窗口顶部 【父窗口可以操作】
      modal: true
      //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
    };
    this.defaultOptions = {
      width: 900,
      height: 700,
      //窗口是否在屏幕居中. 默认值为 false
      center: true,
      //设置为 false 时可以创建一个无边框窗口 默认值为 true。
      frame: false,
      //窗口是否在创建时显示。 默认值为 true。
      show: false,
      transparent: true,
      maxWidth: null,
      maxHeight: null,
      minWidth: null,
      minHeight: null,
      backgroundColor: "rgba(0,0,0,0)",
      autoHideMenuBar: true,
      resizable: true,
      minimizable: true,
      maximizable: true,
      /* 
        【父窗口不能操作】
         模态窗口 -- 模态窗口是禁用父窗口的子窗口，创
         建模态窗口必须设置 parent 和 modal 选项
      */
      modal: true,
      parent: null,
      webPreferences: {
        // nodeIntegration: true,
        contextIsolation: true,
        // nodeIntegrationInWorker: true,
        webSecurity: false,
        // sandbox: false,
        nodeIntegration: true,
        preload: path$1.join(__dirname, "../preload/preload.js")
      }
    };
  }
  /********************************************************************************
   * @brief: 创建窗口
   * @param {object} configurations
   * @param {object} options
   * @return {*}
   ********************************************************************************/
  createWindow(configurations, options) {
    var _a;
    let windowId = 0;
    if (_CreateWindow.group.some((o, i) => {
      windowId = i;
      return o.route === configurations.route;
    })) {
      (_a = this.getWindowById(windowId + 1)) == null ? void 0 : _a.blur();
      return;
    }
    let windowConfig = Object.assign({}, this.defaultConfig, configurations);
    let windowOptions = Object.assign({}, this.defaultOptions, options);
    if (!windowConfig.isMainWin && _CreateWindow.main) {
      windowOptions.parent = _CreateWindow.main;
    }
    let win = new electron.BrowserWindow(windowOptions);
    console.log("window id:" + win.id);
    _CreateWindow.group[win.id - 1] = {
      windowId: win.id,
      route: windowConfig.route
    };
    if (windowConfig.maximize && windowConfig.resizable) {
      win.maximize();
    }
    if (windowConfig.isMainWin) {
      if (_CreateWindow.main) {
        delete _CreateWindow.group[0];
        _CreateWindow.main.close();
      }
      _CreateWindow.main = win;
    } else {
      win.setIgnoreMouseEvents(true, { forward: true });
    }
    let that = this;
    win.on("close", () => {
      _CreateWindow.group.forEach((o, i) => {
        if (this.getWindowById(o.windowId) == win) {
          win.webContents.closeDevTools();
          delete _CreateWindow.group[i];
        }
        if (win == that.main) {
          electron.app.quit();
        }
      });
      win.setOpacity(0);
    });
    win.on("ready-to-show", () => {
      win.show();
      win.focus();
    });
    let winURL;
    if (electron.app.isPackaged) {
      win.loadFile(path$2.join(__dirname, "../../dist/index.html"), {
        hash: windowConfig.route
      });
    } else {
      winURL = windowConfig.route ? `${process.env.VITE_DEV_SERVER_URL}/#${windowConfig.route}` : `${process.env.VITE_DEV_SERVER_URL}}/#`;
      win.loadURL(winURL);
    }
    win.setMenu(null);
    win.once("ready-to-show", () => {
      win.show();
    });
  }
};
_CreateWindow.main = null;
_CreateWindow.group = [];
_CreateWindow.getMainWindow = () => {
  return _CreateWindow.main;
};
let CreateWindow = _CreateWindow;
const Store = require("electron-store");
const store = new Store();
const setItem = (name, item) => {
  store.set(name, item);
};
const getItem = (name) => {
  return store.get(name);
};
const delItem = (name) => {
  store.delete(name);
};
const {
  app,
  protocol,
  BrowserWindow,
  screen,
  ipcMain,
  Menu,
  Tray
} = require("electron");
const path = require("path");
windowControlListener();
ipcMain.on("set-item", (event, name, item) => {
  setItem(name, item);
});
ipcMain.on("del-item", (event, name) => {
  delItem(name);
});
ipcMain.handle("get-item", async (event, name) => {
  return await getItem(name);
});
ipcMain.on("window-create", (event, optionObj, configObj) => {
  let cw = new CreateWindow();
  cw.createWindow(optionObj, configObj);
});
ipcMain.on("store-set", (event, objData) => {
  for (const cur of BrowserWindow.getAllWindows()) {
    if (cur != BrowserWindow.fromWebContents(event.sender)) {
      cur.webContents.send("store-get", objData);
    }
  }
});
const createMainWindow = async () => {
  let mainW = new CreateWindow();
  mainW.createWindow(
    {
      route: "/home",
      isMainWin: true
    },
    {
      width: 720,
      height: 820,
      show: false
    }
  );
  return mainW;
};
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
let tray = null;
app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
  let iconPath = path.join(__dirname, "../../dist/icon.png");
  console.info(iconPath);
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        CreateWindow.getMainWindow().show();
      }
    },
    // 显示窗口
    {
      label: "退出",
      click: () => {
        tray.destroy();
        app.quit();
      }
    }
    // 退出应用
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Electron");
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

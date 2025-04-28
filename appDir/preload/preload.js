"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const setItem = (name, item) => {
  ipcRenderer.send("set-item", name, item);
};
const getItem = async (name) => {
  return await ipcRenderer.invoke("get-item", name);
};
const delItem = (name) => {
  ipcRenderer.send("del-item", name);
};
const createNewWindow = (optionObj, configObj) => {
  ipcRenderer.send("window-create", optionObj, configObj);
};
const getScreenSize = () => {
  return ipcRenderer.invoke("get-screen-size");
};
const setWindowOnTop = (state) => {
  ipcRenderer.send("window-on-top", state);
};
const minimizeWindow = () => {
  ipcRenderer.send("window-min");
};
const maximizeWindow = (state, windowSize = {}) => {
  ipcRenderer.send("window-max", state, windowSize);
};
const closeWindow = () => {
  ipcRenderer.send("window-close");
};
const hideWindow = () => {
  ipcRenderer.send("window-hide");
};
const getImgPath = async () => {
  return await ipcRenderer.invoke("img-path");
};
const getFilePath = async () => {
  return await ipcRenderer.invoke("select-file");
};
const getDirPath = async () => {
  return await ipcRenderer.invoke("select-dir");
};
const setConfigStore = (obj) => {
  ipcRenderer.send("store-set", obj);
};
contextBridge.exposeInMainWorld("myApi", {
  setItem,
  getItem,
  delItem,
  minimizeWindow,
  maximizeWindow,
  setWindowOnTop,
  closeWindow,
  hideWindow,
  createNewWindow,
  getScreenSize,
  getImgPath,
  getFilePath,
  getDirPath,
  setConfigStore,
  // Pinia store 设置被动同步监听
  storeChangeListen: (callbacka) => ipcRenderer.on("store-get", (event, data) => {
    callbacka(data);
  })
});
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

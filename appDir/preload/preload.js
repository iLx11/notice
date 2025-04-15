"use strict";
const { contextBridge, ipcRenderer } = require("electron");
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
contextBridge.exposeInMainWorld("myApi", {
  minimizeWindow,
  maximizeWindow,
  setWindowOnTop,
  closeWindow,
  hideWindow,
  createNewWindow,
  getScreenSize,
  getImgPath,
  getFilePath,
  getDirPath
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

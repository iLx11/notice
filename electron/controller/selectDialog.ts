const { dialog } = require('electron')
const path = require('path')

export const getImgPath = async () => {
  let filePath = await dialog.showOpenDialog({
    title: '选择一张图片',
    buttonLabel: '确认选择',
    properties: ['openFile'],
    filters: [
      {
        name: 'Images',
        extensions: ['gif', 'jpg', 'jpeg', 'png', 'svg', 'webp', 'bmp', 'ico'],
      },
    ],
  })
  return filePath
}

/********************************************************************************
 * @brief: 获取文件路径
 * @return {*}
 ********************************************************************************/
export const getFilePath = async () => {
  let filePath = await dialog.showOpenDialog({
    title: '选择一个文件',
    buttonLabel: '确认选择',
    properties: ['openFile'],
  })
  return filePath
}

/********************************************************************************
 * @brief: 获取文件夹路径
 * @return {*}
 ********************************************************************************/
export const getDirPath = async () => {
  let dirPath = await dialog.showOpenDialog({
    title: '选择一个文件夹',
    buttonLabel: '确认选择',
    properties: ['openDirectory'],
  })
  return dirPath
}

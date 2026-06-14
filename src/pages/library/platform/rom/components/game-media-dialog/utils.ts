import { fileOpen } from 'browser-fs-access'

const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif']
const videoExtensions = ['.mp4', '.webm', '.ogv', '.avi', '.mkv', '.mov']

export function selectImageFile() {
  return fileOpen({ extensions: imageExtensions })
}

export function isVideoFile(fileId: string) {
  return videoExtensions.some((ext) => fileId.toLowerCase().endsWith(ext))
}

export function isImageFile(fileId: string) {
  return imageExtensions.some((ext) => fileId.toLowerCase().endsWith(ext))
}

export function isCbzFile(fileId: string) {
  return fileId.toLowerCase().endsWith('.cbz')
}

export function isPdfFile(fileId: string) {
  return fileId.toLowerCase().endsWith('.pdf')
}

export function getFileExtension(fileIdOrUrl: string) {
  const dotIndex = fileIdOrUrl.lastIndexOf('.')
  if (dotIndex === -1) {
    return ''
  }
  return fileIdOrUrl.slice(dotIndex + 1)
}

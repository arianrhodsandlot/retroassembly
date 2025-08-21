import { fileOpen } from 'browser-fs-access'

const extensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif']
export function selectImageFile() {
  return fileOpen({ extensions })
}

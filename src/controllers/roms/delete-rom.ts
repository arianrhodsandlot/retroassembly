import { deleteRoms } from './delete-roms.ts'

export async function deleteRom(id: string) {
  await deleteRoms([id])
}

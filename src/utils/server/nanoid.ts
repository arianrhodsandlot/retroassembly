import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'

export const nanoid = customAlphabet(nolookalikes, 10)

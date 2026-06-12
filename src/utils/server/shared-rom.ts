import path from 'node:path'
import { eq, or } from 'drizzle-orm'
import { getRuntimeKey } from 'hono/adapter'
import { getDirectories, getRunTimeEnv } from '#@/constants/env.ts'
import { romTable } from '#@/databases/schema.ts'

/**
 * Shared ROM library: a host-mounted, read-only collection of ROMs that is exposed to every user
 * without uploading. Shared ROMs are stored as ordinary `romTable` rows owned by a reserved
 * sentinel user id, and their `fileId` points at the mounted directory instead of app storage.
 * The feature is Node-only; on workerd everything degrades to the original per-user behaviour.
 */

/** Reserved sentinel user id for rows that belong to the shared, host-mounted ROM library. */
export const SHARED_LIBRARY_USER_ID = '__shared__'

/** `fileId` prefix that distinguishes a mounted shared ROM from an uploaded one. */
export const SHARED_ROM_FILE_ID_PREFIX = 'shared-roms/'

/** True when the shared ROM library is enabled. Always false outside the Node runtime. */
export function isSharedLibraryEnabled() {
  if (getRuntimeKey() !== 'node') {
    return false
  }
  return getRunTimeEnv().RETROASSEMBLY_RUN_TIME_ENABLE_SHARED_ROM_LIBRARY === 'true'
}

/** True when the given user id is the shared-library sentinel. */
export function isSharedUserId(userId: null | string | undefined) {
  return userId === SHARED_LIBRARY_USER_ID
}

/** True when a `fileId` refers to a mounted shared ROM rather than an uploaded one. */
export function isSharedRomFileId(fileId: null | string | undefined) {
  return typeof fileId === 'string' && fileId.startsWith(SHARED_ROM_FILE_ID_PREFIX)
}

/**
 * Build the `fileId` for a shared ROM from its on-disk platform folder name and the path relative to
 * that folder. The folder name keeps its actual case so the id resolves on case-sensitive
 * filesystems; the relative path may use native separators (normalized to POSIX `/` here) so
 * `fileId`s are stable across Windows and Linux hosts.
 */
export function buildSharedRomFileId(platformDirName: string, relativePath: string) {
  const normalized = relativePath.split(path.sep).join('/')
  return `${SHARED_ROM_FILE_ID_PREFIX}${platformDirName}/${normalized}`
}

/**
 * Resolve a shared ROM `fileId` to an absolute path on disk, rejecting anything that escapes the
 * configured shared directory. Guards against path traversal and unsafe symlinks, and tolerates
 * read-only mounts (never writes). Returns the realpath when the file exists.
 */
export async function resolveSharedRomPath(fileId: string) {
  if (!isSharedRomFileId(fileId)) {
    throw new Error('Not a shared ROM file id')
  }

  const { sharedRomDirectory } = getDirectories()
  if (!sharedRomDirectory) {
    throw new Error('Shared ROM directory is not configured')
  }
  const root = path.resolve(sharedRomDirectory)

  const relativePosix = fileId.slice(SHARED_ROM_FILE_ID_PREFIX.length)
  if (!relativePosix || relativePosix.startsWith('/') || relativePosix.includes('\0')) {
    throw new Error('Invalid shared ROM path')
  }

  const segments = relativePosix.split('/')
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    throw new Error('Invalid shared ROM path')
  }

  const resolved = path.resolve(root, path.join(...segments))
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error('Shared ROM path escapes the shared directory')
  }

  const { default: fs } = await import('fs-extra')
  if (await fs.pathExists(resolved)) {
    const realRoot = await fs.realpath(root)
    const realTarget = await fs.realpath(resolved)
    if (realTarget !== realRoot && !realTarget.startsWith(realRoot + path.sep)) {
      throw new Error('Shared ROM path escapes the shared directory via a symlink')
    }
    return realTarget
  }

  return resolved
}

/**
 * Drizzle condition selecting ROMs visible to a user: their own uploads plus the shared library
 * when it is enabled. On workerd or when disabled this is identical to the original per-user filter.
 */
export function romOwnershipCondition(userId: string) {
  if (isSharedLibraryEnabled()) {
    return or(eq(romTable.userId, userId), eq(romTable.userId, SHARED_LIBRARY_USER_ID))
  }
  return eq(romTable.userId, userId)
}

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import type { ServerBuild } from 'react-router'
import { applyRuntimeBaseUrl } from './runtime-base-build.ts'

// A minimal stand-in for the generated ServerBuild — only the fields applyRuntimeBaseUrl touches plus
// a couple it must pass through untouched.
function makeBuild(): ServerBuild {
  return {
    assets: {
      entry: {
        imports: ['/assets/jsx-runtime-abc.js'],
        module: '/assets/entry.client-abc.js',
      },
      routes: {
        root: {
          css: ['/assets/root-abc.css'],
          id: 'root',
          imports: ['/assets/base-url-abc.js'],
          module: '/assets/root-abc.js',
        },
      },
      url: '/assets/manifest-abc.js',
      version: 'abc',
    },
    basename: '/',
    entry: { module: '/assets/entry.client-abc.js' },
    future: {},
    publicPath: '/',
    routes: { root: { id: 'root' } },
    ssr: true,
  } as unknown as ServerBuild
}

describe('applyRuntimeBaseUrl', () => {
  test('returns the build unchanged when the base URL is empty', () => {
    const build = makeBuild()
    assert.equal(applyRuntimeBaseUrl(build, ''), build)
  })

  test('prefixes basename, publicPath, and every manifest URL when a base URL is set', () => {
    const patched = applyRuntimeBaseUrl(makeBuild(), '/retro')

    assert.equal(patched.basename, '/retro')
    assert.equal(patched.publicPath, '/retro/')

    assert.equal(patched.assets.url, '/retro/assets/manifest-abc.js')
    assert.equal(patched.assets.entry.module, '/retro/assets/entry.client-abc.js')
    assert.deepEqual(patched.assets.entry.imports, ['/retro/assets/jsx-runtime-abc.js'])

    const { root } = patched.assets.routes
    assert.ok(root)
    assert.equal(root.module, '/retro/assets/root-abc.js')
    assert.deepEqual(root.imports, ['/retro/assets/base-url-abc.js'])
    assert.deepEqual(root.css, ['/retro/assets/root-abc.css'])
  })

  test('does not mutate the original build', () => {
    const build = makeBuild()
    applyRuntimeBaseUrl(build, '/retro')
    assert.equal(build.basename, '/')
    assert.equal(build.assets.url, '/assets/manifest-abc.js')
    assert.equal(build.assets.entry.module, '/assets/entry.client-abc.js')
  })

  test('leaves non-root-relative URLs alone', () => {
    const build = makeBuild()
    build.assets.entry.imports = ['https://cdn.example.com/x.js', '/assets/y.js']
    const patched = applyRuntimeBaseUrl(build, '/retro')
    assert.deepEqual(patched.assets.entry.imports, ['https://cdn.example.com/x.js', '/retro/assets/y.js'])
  })
})

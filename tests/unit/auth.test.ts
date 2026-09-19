import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getSafeRedirectTo, resolveAuthMode } from '#@/utils/server/auth.ts'
import { getOidcConfiguration, getOidcUsernameAndRoles } from '#@/utils/server/oidc.ts'

await describe('authentication helpers', async () => {
  await it('accepts only application-relative redirects', () => {
    assert.equal(getSafeRedirectTo('/library/roms?sort=name'), '/library/roms?sort=name')
    assert.equal(getSafeRedirectTo('https://example.com'), '/library')
    assert.equal(getSafeRedirectTo('//example.com'), '/library')
    assert.equal(getSafeRedirectTo('/a/..//example.com'), '/library')
    assert.equal(getSafeRedirectTo('/a/%2e%2e//example.com'), '/library')
    assert.equal(getSafeRedirectTo('/a/../library?sort=name#games'), '/library?sort=name#games')
    assert.equal(getSafeRedirectTo(String.raw`/\example.com`), '/library')
    assert.equal(getSafeRedirectTo(undefined), '/library')
  })

  await it('retries failed discovery and caches successful discovery across callers', async (t) => {
    const issuer = 'https://id.example'
    t.mock.property(process, 'env', {
      ...process.env,
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID: 'retroassembly',
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET: 'secret',
      RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: issuer,
    })
    const fetchMock = t.mock.method(globalThis, 'fetch', () => Promise.reject(new Error('Temporary provider outage')))

    const failures = await Promise.allSettled([getOidcConfiguration(), getOidcConfiguration()])
    assert.deepEqual(
      failures.map((result) => result.status),
      ['rejected', 'rejected'],
    )
    assert.equal(fetchMock.mock.callCount(), 1)

    fetchMock.mock.mockImplementation(() => Promise.resolve(Response.json({ issuer })))
    const [configuration, concurrentConfiguration] = await Promise.all([getOidcConfiguration(), getOidcConfiguration()])
    assert.equal(configuration.serverMetadata().issuer, issuer)
    assert.equal(concurrentConfiguration, configuration)
    assert.equal(await getOidcConfiguration(), configuration)
    assert.equal(fetchMock.mock.callCount(), 2)
  })

  await it('selects authentication by deployment configuration', () => {
    assert.equal(resolveAuthMode({}, 'node'), 'local')
    assert.equal(
      resolveAuthMode(
        {
          RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: 'key',
          RETROASSEMBLY_RUN_TIME_SUPABASE_URL: 'https://supabase.example',
        },
        'workerd',
      ),
      'supabase',
    )
    assert.equal(
      resolveAuthMode(
        {
          RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID: 'retroassembly',
          RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET: 'secret',
          RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example',
        },
        'node',
      ),
      'oidc',
    )
  })

  await it('rejects incomplete, conflicting, and Workers OIDC configuration', () => {
    const oidc = {
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID: 'retroassembly',
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET: 'secret',
      RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example',
    }
    assert.throws(() => resolveAuthMode({ RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example' }, 'node'))
    assert.throws(() => resolveAuthMode(oidc, 'workerd'))
    assert.throws(() =>
      resolveAuthMode(
        {
          ...oidc,
          RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: 'key',
          RETROASSEMBLY_RUN_TIME_SUPABASE_URL: 'https://supabase.example',
        },
        'node',
      ),
    )
  })

  await it('reads OIDC usernames and role arrays', () => {
    assert.deepEqual(getOidcUsernameAndRoles({ preferred_username: ' arcade ', roles: ['retroassembly', 'other'] }), {
      roles: ['retroassembly', 'other'],
      username: 'arcade',
    })
  })

  await it('normalizes a single OIDC role', () => {
    assert.deepEqual(getOidcUsernameAndRoles({ preferred_username: 'arcade', roles: 'retroassembly' }), {
      roles: ['retroassembly'],
      username: 'arcade',
    })
  })

  await it('allows a missing roles claim when role gating is disabled', () => {
    assert.deepEqual(getOidcUsernameAndRoles({ preferred_username: 'arcade' }), {
      roles: [],
      username: 'arcade',
    })
  })

  await it('rejects missing identity claims', () => {
    assert.throws(() => getOidcUsernameAndRoles({ roles: ['retroassembly'] }))
    assert.throws(() => getOidcUsernameAndRoles({ preferred_username: 'arcade' }, true))
    assert.throws(() => getOidcUsernameAndRoles({ preferred_username: 'arcade', roles: [1] }, true))
  })
})

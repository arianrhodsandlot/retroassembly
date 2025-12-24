import { Badge, Callout, Card, Tabs } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR, { useSWRConfig } from 'swr'
import { client, parseResponse } from '#@/api/client.ts'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { CreateUserDialog } from './create-user-dialog.tsx'
import { DeleteUserDialog } from './delete-user-dialog.tsx'
import { UserTabContent } from './user-tab-content.tsx'

export function AccountsSettings() {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { currentUser } = useGlobalLoaderData()
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: users, error: usersError } = useSWR({ endpoint: 'users', method: 'get' }, () =>
    parseResponse(client.users.$get()),
  )

  // Check if current user is super user (first user)
  const isSuperUser = users && users.length > 0 && users[0].id === currentUser.id

  // Non-super users: Just show password change form without tabs
  if (!isSuperUser) {
    return (
      <div>
        <SettingsTitle>
          <span className='icon-[mdi--account-multiple]' />
          {t('Accounts')}
        </SettingsTitle>
        <Card>
          <UserTabContent canDelete={false} user={currentUser} />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--account-multiple]' />
        {t('Accounts')}
      </SettingsTitle>

      {usersError ? (
        <Callout.Root className='mb-4' color='red'>
          <Callout.Icon>
            <span className='icon-[mdi--information]' />
          </Callout.Icon>
          <Callout.Text>{usersError.message || t('Unknown error')}</Callout.Text>
        </Callout.Root>
      ) : null}

      {/* Super users: Show tabs with users */}
      <Card>
        <Tabs.Root onValueChange={setSelectedUserId} value={selectedUserId || currentUser.id}>
          <Tabs.List>
            {users?.map((user) => (
              <Tabs.Trigger key={user.id} value={user.id}>
                <span className='icon-[mdi--account] mr-2' />
                {user.username}
                {user.id === currentUser.id ? (
                  <Badge color='grass' ml='2' size='1'>
                    {t('Current')}
                  </Badge>
                ) : null}
              </Tabs.Trigger>
            ))}
            <Tabs.Trigger
              className='cursor-pointer'
              onClick={(e) => {
                e.preventDefault()
                setCreateDialogOpen(true)
              }}
              onMouseDown={(e) => e.preventDefault()}
              value='+'
            >
              <span className='icon-[mdi--plus]' />
              <span className='ml-1'>{t('Add User')}</span>
            </Tabs.Trigger>
          </Tabs.List>

          {users?.map((user) => (
            <Tabs.Content key={user.id} value={user.id}>
              <UserTabContent canDelete={!user.isSuper} onDelete={() => setDeleteDialogOpen(true)} user={user} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Card>

      <CreateUserDialog
        onOpenChange={setCreateDialogOpen}
        onSuccess={async (newUserId) => {
          await mutate({ endpoint: 'users', method: 'get' })
          if (newUserId) {
            setSelectedUserId(newUserId)
          }
        }}
        open={createDialogOpen}
      />

      <DeleteUserDialog
        onOpenChange={setDeleteDialogOpen}
        onSuccess={async () => {
          await mutate({ endpoint: 'users', method: 'get' })
          // Switch to current user's tab after deletion
          setSelectedUserId(currentUser.id)
        }}
        open={deleteDialogOpen}
        userId={selectedUserId}
      />
    </div>
  )
}

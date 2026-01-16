import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import { useGameStates } from '../hooks/use-game-states.ts'

const { $delete } = client.states[':id']
export function GameStateDelete({ id }: Readonly<{ id: string }>) {
  const { t } = useTranslation()
  const { reloadStates } = useGameStates()

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'roms', method: 'delete', param: { id } },
    () => $delete({ param: { id } }),
    {
      async onSuccess() {
        await reloadStates()
      },
    },
  )

  async function handleClick() {
    if (confirm(`${t('Confirm delete')}?`)) {
      await trigger()
    }
  }

  return (
    <button
      className='absolute right-0 bottom-0 flex size-8 items-center justify-center rounded text-(--accent-9) hover:bg-(--accent-3)'
      onClick={handleClick}
      title={t('Delete')}
      type='button'
    >
      <span className={isMutating ? 'icon-[svg-spinners--180-ring]' : 'icon-[mdi--delete]'} />
    </button>
  )
}

import { Select, Tooltip } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { shaders } from './shaders.ts'

export function ShaderSelect(props: Readonly<Select.RootProps>) {
  const { t } = useTranslation()

  return (
    <Select.Root {...props}>
      <Select.Trigger />
      <Select.Content>
        {shaders.map((shader) => (
          <Tooltip
            content={
              shader.thumbnail ? (
                <img alt={shader.name} className='my-1 size-120' src={shader.thumbnail} />
              ) : (
                <span className='icon-[mdi--file-question] size-5' />
              )
            }
            delayDuration={0}
            key={shader.id}
            maxWidth='500px'
            open={shader.id ? undefined : false}
            side='right'
          >
            <Select.Item value={shader.id || 'none'}>
              <div className='flex items-center gap-2'>
                <span className={shader.id ? 'icon-[mdi--stars]' : 'icon-[mdi--do-not-disturb-alt]'} />
                <span>{shader.id ? shader.name : t('disabled')}</span>
              </div>
            </Select.Item>
          </Tooltip>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

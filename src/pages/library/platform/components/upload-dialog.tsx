import { Button, Callout, Code, Dialog, Progress } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import confetti from 'canvas-confetti'
import { clsx } from 'clsx'
import { chunk } from 'es-toolkit'
import ky from 'ky'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRouter_UNSTABLE } from 'waku/router/client'
import { platformMap } from '@/constants/platform.ts'

export function UploadDialog({ platform, toggleOpen }: { platform: string; toggleOpen: any }) {
  const router = useRouter_UNSTABLE()

  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({ failure: [], success: [] })

  async function uploadFiles(url: string, files: File[]) {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files[]', file)
    }
    formData.append('platform', platform)
    await ky.put(url, { body: formData })
  }

  const { trigger } = useSWRMutation('/api/v1/rom/new', async (url, { arg: files }: { arg: File[] }) => {
    for (const filesChunk of chunk(files, 10)) {
      const newUploadedFiles = { ...uploadedFiles }
      try {
        await uploadFiles(url, filesChunk)
        newUploadedFiles.success.push(...filesChunk)
      } catch {
        newUploadedFiles.failure.push(...filesChunk)
      }
      setUploadedFiles(newUploadedFiles)
    }
  })

  async function handleClickSelect() {
    const files = await fileOpen({ extensions: platformMap[platform].fileExtensions, multiple: true })
    setFiles(files)
    await trigger(files)
    toggleOpen()
    await confetti({ disableForReducedMotion: true, particleCount: 150, spread: 180 })
    router.reload()
  }

  function prevendDefaultWhenUploading(event: Event) {
    if (files.length > 0) {
      event.preventDefault()
    }
  }

  let status = 'loading'
  if (files.length === 0) {
    status = 'initial'
  }

  return (
    <Dialog.Content
      aria-describedby={undefined}
      onEscapeKeyDown={prevendDefaultWhenUploading}
      onPointerDownOutside={prevendDefaultWhenUploading}
    >
      <Dialog.Title>
        {
          {
            initial: 'Select ROMs',
            loading: 'Uploading ROMs',
          }[status]
        }
      </Dialog.Title>

      {status === 'initial' ? (
        <Callout.Root className={clsx({ hidden: status !== 'initial' })} size='1'>
          <Callout.Icon>
            <span className='icon-[mdi--information]' />
          </Callout.Icon>
          <Callout.Text className='text-xs'>
            You are uploading ROMs for <b>{platformMap[platform].displayName}</b>. We support these file extensions for
            this platform:
            <br />
            <span className='inline-flex gap-1 py-2'>
              {platformMap[platform].fileExtensions.map((extention) => (
                <Code key={extention}>{extention}</Code>
              ))}
            </span>
          </Callout.Text>
        </Callout.Root>
      ) : null}

      {
        {
          initial: (
            <div>
              <div className='mt-4 flex justify-center'>
                <Button onClick={handleClickSelect} size='3'>
                  <span className='icon-[mdi--folder-open]' />
                  Select files
                </Button>
              </div>

              <div className='mt-4 flex justify-end'>
                <Dialog.Close>
                  <Button variant='soft'>
                    <span className='icon-[mdi--close]' />
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          ),

          loading: (
            <div className='my-4'>
              <Progress
                duration='1s'
                size='3'
                value={((uploadedFiles.success.length + uploadedFiles.failure.length) / files.length) * 100}
              />
              <div className='mt-4 flex items-center justify-end gap-2 text-sm text-zinc-400'>
                <span className='icon-[svg-spinners--180-ring] text-zinc' />
                Uploading {uploadedFiles.success.length + uploadedFiles.failure.length}/{files.length}
                {uploadedFiles.failure.length > 0 ? <span>{uploadedFiles.failure.length} Failed</span> : null}
              </div>
            </div>
          ),
        }[status]
      }
    </Dialog.Content>
  )
}

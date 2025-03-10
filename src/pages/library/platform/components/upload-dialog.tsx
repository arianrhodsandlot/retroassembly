'use client'
import { Button, Callout, Code, Dialog, Progress } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { fileOpen } from 'browser-fs-access'
import clsx from 'clsx'
import { chunk } from 'es-toolkit'
import ky from 'ky'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRouter_UNSTABLE } from 'waku/router/client'
import { platformMap } from '@/constants/platform.ts'

export function UploadDialog({ platform }: { platform: string }) {
  const router = useRouter_UNSTABLE()

  const [done, toggleDone] = useToggle()
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({ failure: [], success: [] })

  async function uploadFiles(url: string, files: File[]) {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    formData.append('platform', platform)
    await ky.put(url, { body: formData })
  }

  const { isMutating, trigger } = useSWRMutation('/api/v1/rom/new', async (url, { arg: files }: { arg: File[] }) => {
    for (const filesChunk of chunk(files, 10)) {
      const newUploadedFiles = { ...uploadedFiles }
      try {
        await uploadFiles(url, filesChunk)
        newUploadedFiles.success.push(...filesChunk)
      } catch {
        newUploadedFiles.failure.push(...filesChunk)
      }
      setUploadedFiles(newUploadedFiles)
      if (newUploadedFiles.success.length + newUploadedFiles.failure.length === files.length) {
        toggleDone()
      }
    }
  })

  function handleClickOk() {
    router.reload()
  }

  async function handleClickSelect() {
    const files = await fileOpen({ extensions: platformMap[platform].fileExtensions, multiple: true })
    setFiles(files)
    await trigger(files)
    // router.reload()
  }

  let status = ''
  if (files.length === 0) {
    status = 'initial'
  } else if (isMutating) {
    status = 'loading'
  } else if (done) {
    status = 'done'
  }

  return (
    <Dialog.Content>
      <Dialog.Title>
        {
          {
            done: 'Done',
            initial: 'Select ROMs',
            loading: 'Uploading ROMs',
          }[status]
        }
      </Dialog.Title>

      <Dialog.Description>
        {status === 'initial' ? (
          <Callout.Root className={clsx({ hidden: status !== 'initial' })} size='1'>
            <Callout.Icon>
              <span className='icon-[mdi--information]' />
            </Callout.Icon>
            <Callout.Text>
              <div className='text-xs'>
                <div>
                  You are going to upload ROMs for <b>{platformMap[platform].displayName}</b>.
                </div>
                <div>We support these file extensions for this platform:</div>
                <div className='mt-0.5 flex gap-1'>
                  {platformMap[platform].fileExtensions.map((extention) => (
                    <Code key={extention}>{extention}</Code>
                  ))}
                </div>
              </div>
            </Callout.Text>
          </Callout.Root>
        ) : null}
      </Dialog.Description>

      {
        {
          done: (
            <div>
              <div className='my-8 flex items-center justify-center gap-2 text-lg text-[var(--theme)]'>
                <span>🎉</span>
                ROMs uploaded. Enjoy!
              </div>

              <div className='mt-4 flex justify-end'>
                <Dialog.Close onClick={handleClickOk}>
                  <Button>
                    <span className='icon-[mdi--check]' />
                    OK
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          ),

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
                  <Button type='button' variant='soft'>
                    <span className='icon-[mdi--cancel]' />
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          ),

          loading: (
            <div className='my-4'>
              <Progress
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

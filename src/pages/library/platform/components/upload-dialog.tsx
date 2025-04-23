import { Button, Callout, Code, Dialog, Progress } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import confetti from 'canvas-confetti'
import { clsx } from 'clsx'
import { chunk } from 'es-toolkit'
import ky from 'ky'
import { useDeferredValue, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { platformMap } from '@/constants/platform.ts'

export function UploadDialog({ platform, toggleOpen }: { platform: string; toggleOpen: () => void }) {
  const navigate = useNavigate()
  const { getRootProps, isDragActive } = useDropzone({ onDrop })

  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'done' | 'initial' | 'loading'>('initial')
  const [uploadedFiles, setUploadedFiles] = useState<Record<'failure' | 'loading' | 'success', File[]>>({
    failure: [],
    loading: [],
    success: [],
  })
  const [progress, setProgress] = useState(0)
  const deferedProgress = useDeferredValue(progress)

  async function uploadFiles(url: string, files: File[]) {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files[]', file)
    }
    formData.append('platform', platform)
    await ky.post(url, { body: formData, timeout: false })
  }

  const { trigger } = useSWRMutation('/api/v1/roms', async (url: string, { arg: files }: { arg: File[] }) => {
    let showConfetti = false
    setStatus('loading')

    for (const filesChunk of chunk(files, 10)) {
      const newUploadedFiles = { ...uploadedFiles }
      newUploadedFiles.loading = filesChunk
      setUploadedFiles(newUploadedFiles)
      setProgress(
        ((newUploadedFiles.success.length +
          newUploadedFiles.failure.length +
          Math.floor(newUploadedFiles.loading.length / 2)) /
          files.length) *
          100,
      )

      try {
        await uploadFiles(url, filesChunk)
        newUploadedFiles.success.push(...filesChunk)
        showConfetti = true
      } catch {
        newUploadedFiles.failure.push(...filesChunk)
      }

      newUploadedFiles.loading = []
      setUploadedFiles(newUploadedFiles)
      setProgress(
        ((newUploadedFiles.success.length + newUploadedFiles.failure.length + newUploadedFiles.loading.length) /
          files.length) *
          100,
      )
    }

    setStatus('done')
    if (showConfetti) {
      await confetti({ disableForReducedMotion: true, particleCount: 150, spread: 180 })
    }
  })

  async function handleClickSelect() {
    const files = await fileOpen({ extensions: platformMap[platform].fileExtensions, multiple: true })
    if (files.length > 100) {
      alert('You can only upload up to 100 files at a time.')
      return
    }
    setFiles(files)
    await trigger(files)
  }

  async function onDrop(files: File[]) {
    if (files.length > 100) {
      alert('You can only upload up to 100 files at a time.')
      return
    }
    setFiles(files)
    await trigger(files)
  }

  function prevendDefaultWhenUploading(event: Event) {
    if (files.length > 0) {
      event.preventDefault()
    }
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
            done: 'ROMs uploaded',
            initial: 'Select ROMs',
            loading: 'Uploading ROMs',
          }[status]
        }
      </Dialog.Title>

      {
        {
          initial: (
            <>
              <Callout.Root className={clsx({ hidden: status !== 'initial' })} size='1'>
                <Callout.Icon>
                  <span className='icon-[mdi--information]' />
                </Callout.Icon>
                <Callout.Text className='text-xs'>
                  You are uploading ROMs for <b>{platformMap[platform].displayName}</b>. We support these file
                  extensions for this platform:
                  <br />
                  <span className='inline-flex gap-1 py-2'>
                    {platformMap[platform].fileExtensions.map((extention) => (
                      <Code key={extention}>{extention}</Code>
                    ))}
                  </span>
                </Callout.Text>
              </Callout.Root>

              <div
                {...getRootProps()}
                className={clsx(
                  'border-(--accent-8) mt-4 flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed',
                  { 'bg-(--accent-3)': isDragActive },
                )}
              >
                {isDragActive ? (
                  <span className='text-(--accent-11) text-sm'>Drop files here</span>
                ) : (
                  <>
                    <span className='text-(--accent-11) text-sm'>Drag files here or</span>
                    <Button onClick={handleClickSelect} size='2'>
                      <span className='icon-[mdi--folder-open]' />
                      Select files
                    </Button>
                  </>
                )}
              </div>

              <div className='mt-4 flex justify-end'>
                <Dialog.Close>
                  <Button variant='soft'>
                    <span className='icon-[mdi--close]' />
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </>
          ),

          loading: (
            <div className='my-4'>
              <Progress
                className='[&>.rt-ProgressIndicator]:!duration-3000'
                max={100}
                size='3'
                value={deferedProgress}
              />
              <div className='mt-4 flex items-center gap-2 text-sm text-zinc-400'>
                <span className='icon-[svg-spinners--180-ring] text-zinc' />
                {uploadedFiles.success.length + uploadedFiles.failure.length + uploadedFiles.loading.length}/
                {files.length},
                {uploadedFiles.failure.length > 0 ? <span>{uploadedFiles.failure.length} Failed.</span> : null}
                <span>Please do not turn off your device!</span>
              </div>
            </div>
          ),

          done: (
            <div>
              <div className='py-10 text-center'>
                🎉 {uploadedFiles.success.length}/{files.length} ROM(s) have been uploaded.
              </div>

              <div className='mt-4 flex justify-end'>
                <Dialog.Close>
                  <Button
                    onClick={() => {
                      toggleOpen()
                      navigate('.', { replace: true })
                    }}
                    variant='soft'
                  >
                    <span className='icon-[mdi--check]' />
                    Done
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          ),
        }[status]
      }
    </Dialog.Content>
  )
}

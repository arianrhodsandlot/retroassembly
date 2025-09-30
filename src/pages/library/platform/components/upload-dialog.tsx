import { Button, Callout, Code, Dialog, Progress } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import confetti from 'canvas-confetti'
import { clsx } from 'clsx'
import { chunk } from 'es-toolkit'
import { useDeferredValue, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLoaderData } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { useRouter } from '../../hooks/use-router.ts'
import { getROMMd5 } from '../../utils/file.ts'

export function UploadDialog({ platform, toggleOpen }: Readonly<{ platform: PlatformName; toggleOpen: () => void }>) {
  const { env } = useLoaderData()
  const maxFiles = Number.parseInt(env.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE, 10) || 1000

  const { reloadSilently } = useRouter()
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
    const md5s = await Promise.all(files.map((file) => getROMMd5(file, platform)))
    await client.roms.$post({ form: { 'files[]': files, md5s: JSON.stringify(md5s), platform } })
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

    if (uploadedFiles.success.length === files.length) {
      toggleOpen()
      reloadSilently()
    } else {
      setStatus('done')
    }
    if (showConfetti) {
      await confetti({ disableForReducedMotion: true, particleCount: 150, spread: 180 })
    }
  })

  function validateFiles(files: File[]) {
    let message = ''
    if (files.length > maxFiles) {
      message = `You can only upload up to ${maxFiles} files at a time.`
    } else if (files.some((file) => !platformMap[platform].fileExtensions.some((ext) => file.name.endsWith(ext)))) {
      message = `Please only upload files with the following extensions:\n${platformMap[platform].fileExtensions.join(', ')}`
    }
    return message
  }

  async function handleClickSelect() {
    const files = await fileOpen({ extensions: platformMap[platform].fileExtensions, multiple: true })
    const message = validateFiles(files)
    if (message) {
      alert(message)
      return
    }
    setFiles(files)
    await trigger(files)
  }

  async function onDrop(files: File[]) {
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at a time.`)
      return
    }
    const message = validateFiles(files)
    if (message) {
      alert(message)
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

  function handleClickDone() {
    toggleOpen()
    reloadSilently()
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
                  <span className='icon-[mdi--information] mt-1.5' />
                </Callout.Icon>
                <Callout.Text className='text-xs'>
                  You are uploading ROMs for{' '}
                  <img
                    alt={platformMap[platform].displayName}
                    className='inline-block size-7 align-middle'
                    src={getPlatformIcon(platform)}
                  />
                  <b>{platformMap[platform].displayName}</b>. We support these file extensions for this platform:
                  <br />
                  <span className='inline-flex gap-1 py-2'>
                    {platformMap[platform].fileExtensions.map((extention) => (
                      <Code key={extention}>{extention}</Code>
                    ))}
                  </span>
                  {platform === 'gameandwatch' ? (
                    <>
                      <br />
                      <span>
                        Games can be downloaded from{' '}
                        <a
                          className='underline'
                          href='https://buildbot.libretro.com/assets/cores/Handheld%20Electronic%20Game/'
                          rel='noreferrer noopener'
                          target='_blank'
                        >
                          buildbot.libretro.com
                        </a>
                        .
                      </span>
                    </>
                  ) : null}
                  <br />
                  <span>
                    You can upload up to <b>{maxFiles}</b> files at a time.
                  </span>
                </Callout.Text>
              </Callout.Root>

              <div
                {...getRootProps()}
                className={clsx(
                  'border-(--accent-8) mt-4 flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed outline-none',
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

              <div className='text-(--accent-9) mt-4 text-xs'>
                Please upload only ROMs you legally own, such as personal backups of games you purchased or homebrew
                titles. By uploading, you confirm compliance with all applicable laws.
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
              <div className='text-(--gray-11) mt-4 flex items-center gap-2 text-sm'>
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
                  <Button onClick={handleClickDone} variant='soft'>
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

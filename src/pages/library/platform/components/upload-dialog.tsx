import { Button, Dialog, Progress } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import confetti from 'canvas-confetti'
import { clsx } from 'clsx'
import { chunk, isPlainObject } from 'es-toolkit'
import { isMatch } from 'es-toolkit/compat'
import { useDeferredValue, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { useRouter } from '../../hooks/use-router.ts'
import { getROMMd5 } from '../../utils/file.ts'
import { UploadInstruction } from './upload-instruction.tsx'

export function UploadDialog({ platform, toggleOpen }: Readonly<{ platform: PlatformName; toggleOpen: () => void }>) {
  const { t } = useTranslation()
  const { env, isOfficialHost } = useLoaderData()
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

  async function uploadFiles(_url: string, files: File[]) {
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
      await reloadSilently()
      await mutate((key) => isPlainObject(key) && isMatch(key, { endpoint: 'roms/search' }), false)
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
      message = t('You can only upload up to {{maxFiles}} files at a time.', { maxFiles })
    } else if (files.some((file) => !platformMap[platform].fileExtensions.some((ext) => file.name.endsWith(ext)))) {
      message = `${t('Please only upload files with the following extensions:')}\n${platformMap[platform].fileExtensions.join(', ')}`
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
      alert(t('You can only upload up to {{maxFiles}} files at a time.', { maxFiles }))
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

  async function handleClickDone() {
    toggleOpen()
    await reloadSilently()
    await mutate((key) => isPlainObject(key) && isMatch(key, { endpoint: 'roms/search' }), false)
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
            done: t('ROMs uploaded'),
            initial: t('Select ROMs'),
            loading: t('Uploading ROMs'),
          }[status]
        }
      </Dialog.Title>

      {
        {
          initial: (
            <>
              <UploadInstruction maxFiles={maxFiles} platform={platform} />

              <div
                {...getRootProps()}
                className={clsx(
                  'border-(--accent-8) mt-4 flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed outline-none',
                  { 'bg-(--accent-3)': isDragActive },
                )}
              >
                {isDragActive ? (
                  <span className='text-(--accent-11) text-sm'>{t('Drop files here')}</span>
                ) : (
                  <>
                    <span className='text-(--accent-11) text-sm'>{t('Drag files here or')}</span>
                    <Button onClick={handleClickSelect} size='2'>
                      <span className='icon-[mdi--folder-open]' />
                      {t('Select files')}
                    </Button>
                  </>
                )}
              </div>

              {isOfficialHost ? (
                <div className='text-(--accent-9) mt-4 flex flex-col gap-1 text-xs'>
                  <p>
                    {t('Please upload only ROMs you legally own, such as personal backups of games you purchased or homebrew titles. By uploading, you confirm compliance with all applicable laws.')}
                  </p>
                  <p>
                    {t('Useful links about dumping ROMs:')}{' '}
                    <a className='underline' href='https://dumping.guide/' rel='noreferrer noopener' target='_blank'>
                      dumping.guide
                    </a>
                    ,{' '}
                    <a
                      className='underline'
                      href='https://emulation.gametechwiki.com/index.php/Ripping_games'
                      rel='noreferrer noopener'
                      target='_blank'
                    >
                      Ripping games - Emulation General Wiki
                    </a>
                    .
                  </p>
                </div>
              ) : null}

              <div className='mt-4 flex justify-end'>
                <Dialog.Close>
                  <Button variant='soft'>
                    <span className='icon-[mdi--close]' />
                    {t('Cancel')}
                  </Button>
                </Dialog.Close>
              </div>
            </>
          ),

          loading: (
            <div className='my-4'>
              <Progress
                className='[&>.rt-ProgressIndicator]:duration-3000!'
                max={100}
                size='3'
                value={deferedProgress}
              />
              <div className='text-(--gray-11) mt-4 flex items-center gap-2 text-sm'>
                <span className='icon-[svg-spinners--180-ring] text-zinc' />
                {uploadedFiles.success.length + uploadedFiles.failure.length + uploadedFiles.loading.length}/
                {files.length},
                {uploadedFiles.failure.length > 0 ? <span>{uploadedFiles.failure.length} {t('Failed')}.</span> : null}
                <span>{t('Please do not turn off your device!')}</span>
              </div>
            </div>
          ),

          done: (
            <div>
              <div className='py-10 text-center'>
                {t('🎉 {{successCount}}/{{totalCount}} ROM(s) have been uploaded.', {
                  successCount: uploadedFiles.success.length,
                  totalCount: files.length,
                })}
              </div>

              <div className='mt-4 flex justify-end'>
                <Dialog.Close>
                  <Button onClick={handleClickDone} variant='soft'>
                    <span className='icon-[mdi--check]' />
                    {t('Done')}
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

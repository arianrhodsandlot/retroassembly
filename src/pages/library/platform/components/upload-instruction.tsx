import { Callout, Code } from '@radix-ui/themes'
import { Trans, useTranslation } from 'react-i18next'
import { platformMap, type PlatformName } from '#@/constants/platform.ts'
import { getPlatformIcon } from '#@/utils/client/library.ts'

export function UploadInstruction({
  maxFiles,
  maxRomCount,
  platform,
}: Readonly<{ maxFiles: number; maxRomCount: number; platform: PlatformName }>) {
  const { t } = useTranslation()

  return (
    <Callout.Root size='1'>
      <Callout.Icon>
        <span className='icon-[mdi--information] mt-1.5' />
      </Callout.Icon>
      {/* @ts-expect-error the 'as' prop is valid here as it will be passed to a Text internally */}
      <Callout.Text as='div' className='flex flex-col gap-1 text-xs'>
        <p>
          {t('upload.uploadingForPlatform')}
          <img
            alt={t(platformMap[platform].displayName)}
            className='inline-block size-7 align-middle'
            src={getPlatformIcon(platform)}
          />
          <b>{t(platformMap[platform].displayName)}</b>. {t('upload.supportedPlatformExtensions')}
          <br />
          <span className='inline-flex gap-1 py-2'>
            {platformMap[platform].fileExtensions.map((extention) => (
              <Code key={extention}>{extention}</Code>
            ))}
          </span>
        </p>

        {
          {
            arcade: (
              <p>
                <Trans components={{ 1: <b /> }} i18nKey='home.fullNonMergedRomsetsTip' />
              </p>
            ),
            gameandwatch: (
              <p>
                <span>
                  {t('home.gamesDownloadSource')}{' '}
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
              </p>
            ),
            pcengine: (
              <p>
                <Trans components={{ 1: <b /> }} i18nKey='platform.pcengineNoteExtra' />
              </p>
            ),
          }[platform]
        }

        <p>
          <Trans components={{ 1: <b /> }} i18nKey='upload.maxFilesDescription' values={{ maxFiles }} />

          {Number.isFinite(maxRomCount) ? (
            <Trans components={{ 1: <b /> }} i18nKey='sponsor.romLimitDescription' values={{ maxRomCount }} />
          ) : null}
        </p>
      </Callout.Text>
    </Callout.Root>
  )
}
